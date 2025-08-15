"use client";
import { useEffect, useState, useTransition } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ReportFormData } from "@/types/ReportFormData";
import { AssistanceTypes } from "@/types/AssistanceTypes";
import { Report, ReportImage } from "@/types/Report";
import {
  createFormDataFromReport,
  defaultReportFormData,
  createEditedReport,
} from "@/configs/reportConfig";
import { createReport, getReports, updateReport } from "@/api/reports";
import { deleteImage } from "@/api/images";
import PersonalSection from "@/components/formSections/PersonalSection";
import AssistancesSection from "@/components/formSections/AssistancesSection";
import AdditionalDetailSection from "@/components/formSections/AdditionalDetailSection";
import ImageSection from "@/components/formSections/ImageSection";
import getAddressFromLatLng from "@/libs/getAddressFromLatLng";

function Form() {
  const router = useRouter();

  const [oldReport, setOldReport] = useState<Report>();
  const [mode, setMode] = useState<"CREATE" | "EDIT" | "VEIW">();

  const [assistanceTypes, setAssistanceTypes] = useState<AssistanceTypes[]>([]);
  const methods = useForm<ReportFormData>();
  const {
    setError,
    clearErrors,
    watch,
    reset,
    formState: { errors },
  } = methods;

  const [images, setImages] = useState<File[]>([]);
  const [oldImages, setOldImages] = useState<ReportImage[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

  const [isPending, startTransition] = useTransition();
  const [confirmChecked, setConfirmChecked] = useState(false);

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
          const reports = await getReports(uid);
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
          const reports = await getReports(uid);
          const report = reports.find((report) => report.id === Number(id));
          if (!report) {
            router.replace("/request-location");
          } else {
            setOldReport(report);
            const init = await createFormDataFromReport(report);
            setAssistanceTypes(init.assistanceTypes);
            reset(init.formData);
            setOldImages(report.images);
            if (report.reportStatus.status == "PENDING") {
              setMode("EDIT");
            } else {
              setMode("VEIW");
            }
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

  async function handleUpdateReport(formData: ReportFormData) {
    if (!oldReport) {
      throw new Error("No report");
    }
    // ลบรูปก่อน
    for (const id of deletedImageIds) {
      await deleteImage(id);
    }
    // ดึง report ที่ลบรูปแล้วมา
    const reports = await getReports(oldReport.userId);
    const updatedOldReport = reports.find(
      (report) => report.id == oldReport.id
    );
    if (!updatedOldReport) throw new Error("Report not found after update");
    // อัพเดต report
    const updatedReport = createEditedReport(formData, updatedOldReport);
    await updateReport(updatedReport, images);
  }

  function onSubmit(data: ReportFormData) {
    const assistances = watch("reportAssistances") || [];
    const isAtLeastOneChecked = assistances.some((a) => a.isActive);

    if (!isAtLeastOneChecked) {
      setError("reportAssistances", {
        type: "manual",
        message: "กรุณาเลือกความช่วยเหลืออย่างน้อย 1 รายการ",
      });
      return;
    }

    if (images.length + oldImages.length < 1) {
      setError("images" as any, {
        type: "manual",
        message: "กรุณาอัปโหลดรูปอย่างน้อย 1 รูป",
      });
      return;
    }

    if (mode == "CREATE") {
      startTransition(async () => {
        await createReport(data, images);
      });
      router.replace("/success");
    } else if (mode == "EDIT") {
      try {
        startTransition(async () => {
          await handleUpdateReport(data);
        });
        router.replace("/success");
      } catch (e) {
        console.error(e);
        router.replace("/fail");
      }
    }
  }

  return (
    <div className={`${isPending ? "pointer-events-none opacity-50" : ""}`}>
      <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
        <div className="w-full max-w-2xl bg-white p-8 shadow-md rounded-lg">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <fieldset disabled={mode === "VEIW"}>
                <PersonalSection />
                <AssistancesSection assistanceTypes={assistanceTypes} />
                {errors.reportAssistances && (
                  <label className="text-red-500 mt-2">
                    {errors.reportAssistances.message}
                  </label>
                )}
                <AdditionalDetailSection />
                <ImageSection
                  onImagesChange={setImages}
                  deletedImageIds={deletedImageIds}
                  setDeletedImageIds={setDeletedImageIds}
                  initialImages={oldImages}
                />
                {(errors as Record<string, any>).images && (
                  <label className="text-red-500 mb-2">
                    {(errors as Record<string, any>).images.message}
                  </label>
                )}

                <label className="m-3 mt-10 text-red-500 flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="mr-4 w-6 h-6"
                    checked={confirmChecked}
                    onChange={(e) => setConfirmChecked(e.target.checked)}
                  />
                  ยืนยันการส่งข้อมูล
                </label>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className={`w-full ${
                      !confirmChecked ? "disable-button" : "confirm-button"
                    }`}
                    disabled={!confirmChecked}
                    onClick={() => clearErrors()}
                  >
                    ขอความช่วยเหลือ
                  </button>
                </div>
              </fieldset>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}

export default Form;
