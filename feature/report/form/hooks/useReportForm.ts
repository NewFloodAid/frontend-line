"use client";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  createReport,
  getReportById,
  getReports,
  updateReport,
} from "@/api/reports";
import { deleteImage } from "@/api/images";
import {
  createFormDataFromReport,
  defaultReportFormData,
  createEditedReport,
} from "@/feature/report/utils/reportConfig";
import { Report, ReportImage } from "@/types/Report";
import { ReportFormData } from "@/types/ReportFormData";
import { AssistanceTypes } from "@/types/AssistanceTypes";
import getAddressFromLatLng from "@/libs/getAddressFromLatLng";
import { FormMode } from "@/types/FormMode";

interface ReportFormDataForForm extends ReportFormData {
  images?: File[]; // ใช้เฉพาะ validation ไม่ส่งไป backend
}

export function useReportForm() {
  // รายงานที่โหลดมาในกรณี EDIT / VIEW
  const [existingReport, setExistingReport] = useState<Report>();

  // โหมดการทำงานของฟอร์ม
  const [mode, setMode] = useState<FormMode>();

  // เก็บไฟล์ใหม่ที่ user upload
  const [images, setImages] = useState<File[]>([]);

  // เก็บรูปเดิมของ report (ใช้ใน EDIT mode)
  const [oldImages, setOldImages] = useState<ReportImage[]>([]);

  // id ของรูปที่ถูกลบใน EDIT mode
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

  const router = useRouter();
  const [assistanceTypes, setAssistanceTypes] = useState<AssistanceTypes[]>([]);
  const [isPending, startTransition] = useTransition();
  const [confirmChecked, setConfirmChecked] = useState(false);

  const methods = useForm<ReportFormDataForForm>();
  const { setError, watch, reset } = methods;

  /**
   * เตรียมข้อมูลเริ่มต้นของฟอร์ม
   *
   * CREATE:
   * - มี lat,lng
   * - โหลดข้อมูล user → auto fill ชื่อ/นามสกุล เบอร์โทร ถ้ามี
   * - โหลด address จากพิกัด
   *
   * EDIT / VIEW:
   * - มี id
   * - โหลด report จาก backend
   * - ถ้า status = PENDING และเป็นเจ้าของ → EDIT
   * - อื่น ๆ → VIEW
   */
  function setupForm() {
    const urlParams = new URLSearchParams(window.location.search);
    const lat = urlParams.get("lat");
    const lng = urlParams.get("lng");
    const id = urlParams.get("id");
    if (lat && lng) {
      startTransition(async () => {
        const uid = localStorage.getItem("uid");
        if (!uid) {
          router.replace("/");
        } else {
          const reports = await getReports({ userId: uid }, uid);
          const address = await getAddressFromLatLng(lat, lng);
          const init = await defaultReportFormData(uid, address, reports[0]);
          setAssistanceTypes(init.assistanceTypes);
          reset(init.formData);
          setMode("CREATE");
        }
      });
    } else if (id) {
      startTransition(async () => {
        const uid = localStorage.getItem("uid");
        if (!uid) {
          router.replace("/");
        } else {
          try {
            const report = await getReportById(id, uid);
            if (!report) {
              setMode("NOTFOUND");
              return;
            }
            setExistingReport(report);
            const init = await createFormDataFromReport(report);
            setAssistanceTypes(init.assistanceTypes);
            reset(init.formData);
            setOldImages(report.images);
            if (
              report.reportStatus.status == "PENDING" &&
              report.userId == uid
            ) {
              setMode("EDIT");
            } else {
              setMode("VIEW");
            }
          } catch (err: unknown) {
            alert(String(err));
          }
        }
      });
    } else {
      router.replace("/request-location");
    }
  }

  useEffect(() => {
    setupForm();
  }, []);

  /**
   * อัปเดตรายงาน (เฉพาะ EDIT mode)
   *
   * ขั้นตอน:
   * 1. ลบรูปที่ user เลือกลบ
   * 2. ดึง report ล่าสุดจาก backend
   * 3. รวมข้อมูลใหม่เข้ากับ report เดิม
   * 4. ส่ง update พร้อมไฟล์ใหม่
   */
  async function handleUpdateReport(formData: ReportFormData) {
    if (!existingReport) {
      throw new Error("No report");
    }
    // ลบรูปก่อน
    for (const id of deletedImageIds) {
      await deleteImage(id);
    }
    // ดึง report ที่ลบรูปแล้วมา
    const report = await getReportById(
      existingReport.id,
      existingReport.userId,
    );
    const updatedOldReport = report;
    if (!updatedOldReport) throw new Error("Report not found after update");
    // อัพเดต report
    const updatedReport = createEditedReport(formData, updatedOldReport);
    await updateReport(updatedReport, images);
  }

  /**
   * ตรวจสอบเงื่อนไขก่อนส่งฟอร์ม:
   * - ต้องเลือกเรื่องที่ต้องการแจ้งอย่างน้อย 1 รายการ
   * - ต้องมีรูปอย่างน้อย 1 รูป (ใหม่ + เก่า)
   *
   * จากนั้นเรียก CREATE หรือ EDIT ตาม mode
   */
  function onSubmit(data: ReportFormData) {
    const assistances = watch("reportAssistances") || [];
    const isAtLeastOneChecked = assistances.some((a) => a.isActive);

    if (!isAtLeastOneChecked) {
      setError("reportAssistances", {
        type: "manual",
        message: "กรุณาเลือกเรื่องที่ต้องการแจ้งอย่างน้อย 1 รายการ",
      });
      return;
    }

    if (images.length + oldImages.length < 1) {
      setError("images", {
        type: "manual",
        message: "กรุณาอัปโหลดรูปอย่างน้อย 1 รูป",
      });
      return;
    }

    if (mode === "CREATE") {
      startTransition(async () => {
        try {
          await createReport(data, images);
          router.replace("/success");
        } catch (e) {
          console.error(e);
          router.replace("/fail");
        }
      });
    } else if (mode === "EDIT") {
      startTransition(async () => {
        try {
          await handleUpdateReport(data);
          router.replace("/success");
        } catch (e) {
          console.error(e);
          router.replace("/fail");
        }
      });
    }
  }

  return {
    mode,
    methods,
    onSubmit,
    isPending,
    assistanceTypes,
    images,
    setImages,
    oldImages,
    deletedImageIds,
    setDeletedImageIds,
    confirmChecked,
    setConfirmChecked,
    existingReport,
  };
}
