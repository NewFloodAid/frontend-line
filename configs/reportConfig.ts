import { Location, ReportFormData } from "@/types/ReportFormData";
import { getAssistanceTypes } from "@/api/assistanceTypes";
import { AssistanceTypes } from "@/types/AssistanceTypes";
import { Report } from "@/types/Report";

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

export async function createFormDataFromReport(
  report: Report
): Promise<{ formData: ReportFormData; assistanceTypes: AssistanceTypes[] }> {
  const assistanceTypes = await getAssistanceTypes();

  const formData: ReportFormData = {
    userId: report.userId,
    firstName: report.firstName,
    lastName: report.lastName,
    location: report.location,
    mainPhoneNumber: report.mainPhoneNumber,
    reservePhoneNumber: report.reservePhoneNumber,
    additionalDetail: report.additionalDetail,
    reportAssistances: report.reportAssistances,
  };

  return { formData, assistanceTypes };
}

export function createEditedReport(
  formData: ReportFormData,
  oldReport: Report
): Report {
  return {
    ...oldReport,
    userId: formData.userId,
    firstName: formData.firstName,
    lastName: formData.lastName,
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

export function createUpdatedReport(
  oldReport: Report,
  details: string
): Report {
  return {
    ...oldReport,
    afterAdditionalDetail: details,
    reportAssistances: oldReport.reportAssistances.map((assist) => ({
      ...assist,
      quantity: 0,
      isActive: false,
    })),
  };
}

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
