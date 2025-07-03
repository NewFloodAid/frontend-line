import { getReport, GetReportBody } from "@/app/api/getReport";
const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/reports`;

export const createUpdateReport = async (
  report: GetReportBody,
  personalDetails: {
    firstName: string;
    lastName: string;
    phone: string;
    alternatePhone: string;
  },
  needs: {
    id: number;
    name: string;
    unit: string;
    quantity: number;
  }[],
  details: string
): Promise<GetReportBody> => {
  const updatedReport = {
    ...report,
    firstName: personalDetails.firstName,
    lastName: personalDetails.lastName,
    mainPhoneNumber: personalDetails.phone,
    reservePhoneNumber: personalDetails.alternatePhone,
    additionalDetail: details,
    reportAssistances: needs.map((need) => {
      const existingAssistance = report.reportAssistances.find(
        (assistance) => assistance.assistanceType.id === need.id
      );

      return {
        id: existingAssistance?.id ?? 0, // ถ้าไม่มีค่า id ให้ใช้ 0
        assistanceType: existingAssistance?.assistanceType ?? {
          id: need.id,
          name: "",
          priority: 0,
          unit: "",
        },
        quantity: need.quantity,
        isActive: need.quantity > 0 ? true : false,
        reportId: report.id,
      };
    }),
  };

  return updatedReport;
};

export const sentUpdateReport = async (
  report: GetReportBody,
  photos: File[]
) => {
  try {
    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) {
      throw new Error("User is not authenticated.");
    }

    const data = await getReport(report.userId);
    const oldReport = data.find((item) => item.id === report.id);
    if (oldReport?.reportStatus.status != "PENDING") return false;
    const formData = new FormData();
    formData.append("report", JSON.stringify(report)); // เพิ่ม report ในรูปแบบ JSON string
    photos.forEach((file) => {
      formData.append("files", file); // เพิ่ม photos ในรูปแบบไฟล์
    });
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "X-Source-App": "LIFF",
      },
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`status: ${response.status}`);
    }
    const result = await response.json();
    // console.log("Response from backend:", result);
    return result;
  } catch (error) {
    console.error("Error sending help request:", error);
    throw error;
  }
};
