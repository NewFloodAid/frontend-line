"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createReport, getReportById, getReports, updateReport } from "@/api/reports";
import { deleteImage } from "@/api/images";
import {
  createEditedReport,
  createFormDataFromReport,
  defaultReportFormData,
} from "@/feature/report/utils/reportConfig";
import { Report, ReportImage } from "@/types/Report";
import { ReportFormData } from "@/types/ReportFormData";
import { AssistanceTypes } from "@/types/AssistanceTypes";
import getAddressFromLatLng from "@/libs/getAddressFromLatLng";
import { FormMode } from "@/types/FormMode";

interface ReportFormDataForForm extends ReportFormData {
  images?: File[];
}

export function useReportForm() {
  const [existingReport, setExistingReport] = useState<Report>();
  const [mode, setMode] = useState<FormMode>();

  const [images, setImages] = useState<File[]>([]);
  const [oldImages, setOldImages] = useState<ReportImage[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

  const [assistanceTypes, setAssistanceTypes] = useState<AssistanceTypes[]>([]);
  const [confirmChecked, setConfirmChecked] = useState(false);

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const methods = useForm<ReportFormDataForForm>();
  const { setError, reset } = methods;

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
          return;
        }

        const reports = await getReports({ userId: uid }, uid);
        const address = await getAddressFromLatLng(lat, lng);
        const init = await defaultReportFormData(uid, address, reports[0]);

        setAssistanceTypes(init.assistanceTypes);
        reset(init.formData);
        setMode("CREATE");
      });
      return;
    }

    if (id) {
      startTransition(async () => {
        const uid = localStorage.getItem("uid");
        if (!uid) {
          router.replace("/");
          return;
        }

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

          if (report.reportStatus.status === "PENDING" && report.userId === uid) {
            setMode("EDIT");
          } else if (
            report.reportStatus.status === "SENT" ||
            report.reportStatus.status === "SUCCESS"
          ) {
            setMode("UPDATE");
          } else {
            setMode("VIEW");
          }
        } catch (err: unknown) {
          alert(String(err));
        }
      });
      return;
    }

    router.replace("/request-location");
  }

  useEffect(() => {
    setupForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleUpdateReport(formData: ReportFormData) {
    if (!existingReport) {
      throw new Error("No report");
    }

    for (const id of deletedImageIds) {
      await deleteImage(id);
    }

    const report = await getReportById(existingReport.id, existingReport.userId);
    if (!report) {
      throw new Error("Report not found after update");
    }

    const updatedReport = createEditedReport(formData, report);
    await updateReport(updatedReport, images);
  }

  function sanitizeReportPayload(data: ReportFormData): ReportFormData {
    return {
      ...data,
      reportAssistances: (data.reportAssistances ?? []).map((assistance) => {
        const active = Boolean(assistance.isActive) || (assistance.quantity ?? 0) > 0;
        const extraDetail = assistance.extraDetail?.trim() ?? "";

        return {
          ...assistance,
          isActive: active,
          quantity: active ? Math.max(1, assistance.quantity ?? 1) : 0,
          extraDetail: active ? extraDetail : "",
        };
      }),
    };
  }

  function onSubmit(data: ReportFormData) {
    const sanitizedData = sanitizeReportPayload(data);
    const selectedAssistances = sanitizedData.reportAssistances.filter((item) => item.isActive);

    if (selectedAssistances.length === 0) {
      setError("reportAssistances", {
        type: "manual",
        message: "กรุณาเลือกเรื่องที่ต้องการแจ้งเหตุอย่างน้อย 1 รายการ",
      });
      return;
    }

    const missingRequiredType = selectedAssistances.find((assistance) => {
      const typeMeta = assistanceTypes.find((type) => type.id === assistance.assistanceType.id);
      if (!typeMeta?.extraFieldRequired) {
        return false;
      }
      return !(assistance.extraDetail?.trim() ?? "");
    });

    if (missingRequiredType) {
      const typeMeta = assistanceTypes.find(
        (type) => type.id === missingRequiredType.assistanceType.id,
      );
      const fieldLabel = typeMeta?.extraFieldLabel?.trim() || "ข้อมูลเพิ่มเติม";
      const typeName = typeMeta?.name || "หัวข้อที่เลือก";

      setError("reportAssistances", {
        type: "manual",
        message: `กรุณากรอก${fieldLabel} สำหรับ ${typeName}`,
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
          await createReport(sanitizedData, images);
          router.replace("/success");
        } catch (e) {
          console.error(e);
          router.replace("/fail");
        }
      });
      return;
    }

    if (mode === "EDIT") {
      startTransition(async () => {
        try {
          await handleUpdateReport(sanitizedData);
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
