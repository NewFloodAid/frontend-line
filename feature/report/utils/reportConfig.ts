import { Location, ReportFormData } from "@/types/ReportFormData";
import { getAssistanceTypes } from "@/api/assistanceTypes";
import { AssistanceTypes } from "@/types/AssistanceTypes";
import { Report } from "@/types/Report";

// สร้าง report type สำหรับใช้กับหน้า form
export async function defaultReportFormData(
  uid: string,
  address: Location,
  oldReport?: Report
): Promise<{ formData: ReportFormData; assistanceTypes: AssistanceTypes[] }> {
  const assistanceTypes = await getAssistanceTypes();

  const formData: ReportFormData = {
    userId: uid,
    firstName: oldReport?.firstName || "",
    lastName: oldReport?.lastName || "",
    isAnonymous: false,
    location: address,
    mainPhoneNumber: oldReport?.mainPhoneNumber || "",
    reservePhoneNumber: oldReport?.reservePhoneNumber || "",
    additionalDetail: "",
    reportAssistances: assistanceTypes.map((type) => ({
      assistanceType: { id: type.id },
      quantity: 0,
      isActive: false,
    })),
  };

  return { formData, assistanceTypes };
}

// เปลี่ยน report type จาก backend ให้ใช้กับหน้า form ได้
export async function createFormDataFromReport(
  report: Report
): Promise<{ formData: ReportFormData; assistanceTypes: AssistanceTypes[] }> {
  const assistanceTypes = await getAssistanceTypes();

  const formData: ReportFormData = {
    userId: report.userId,
    firstName: report.firstName,
    lastName: report.lastName,
    isAnonymous: report.isAnonymous,
    location: report.location,
    mainPhoneNumber: report.mainPhoneNumber,
    reservePhoneNumber: report.reservePhoneNumber,
    additionalDetail: report.additionalDetail,
    reportAssistances: report.reportAssistances,
  };

  return { formData, assistanceTypes };
}

// สร้าง report type ของ report ที่ user แก้ไขใช้ส่งต่อ backend
export function createEditedReport(
  formData: ReportFormData,
  oldReport: Report
): Report {
  return {
    ...oldReport,
    userId: formData.userId,
    firstName: formData.firstName,
    lastName: formData.lastName,
    isAnonymous: formData.isAnonymous,
    mainPhoneNumber: formData.mainPhoneNumber,
    reservePhoneNumber: formData.reservePhoneNumber,
    additionalDetail: formData.additionalDetail,
    reportAssistances: oldReport.reportAssistances.map((reportAssistance) => {
      const formDataAssistance = formData.reportAssistances.find(
        (formDataAssistance) =>
          formDataAssistance.assistanceType.id ===
          reportAssistance.assistanceType.id
      );
      return {
        ...reportAssistance,
        quantity: formDataAssistance?.quantity ?? 0,
        isActive: formDataAssistance?.isActive ?? false,
      };
    }),
  };
}

// สร้าง report type ของ report ที่ user อัพเดทความคืบหน้าของคำขอใช้ส่งต่อ backend
export function createUpdatedReport(
  oldReport: Report,
  details: string
): Report {
  return {
    ...oldReport,
    afterAdditionalDetail: details,
    reportAssistances: oldReport.reportAssistances.map((assist) => ({
      ...assist,
      isActive: false,
    })),
  };
}

// อัพเดทสถานะของคำขอให้เป็น success
export function createUpdatedStatusReport(oldReport: Report): Report {
  return {
    ...oldReport,
    reportStatus: {
      id: 4,
      status: "SUCCESS",
      userOrderingNumber: 4,
      governmentOrderingNumber: 4,
    },
  };
}
