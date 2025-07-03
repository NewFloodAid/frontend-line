import { getReport } from "./getReport";
const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/reports`;

export const deleteReport = async (userId: string, reportId: number) => {
  try {
    const data = await getReport(userId);
    const report = data.find((item) => item.id === reportId);
    if (!report) return false;
    if (report.reportStatus.status == "PENDING") {
      return await deleteApi(reportId);
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
};

const deleteApi = async (reportId: number) => {
  try {
    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) {
      throw new Error("User is not authenticated.");
    }
    const response = await fetch(`${API_URL}/${reportId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "X-Source-App": "LIFF",
      },
    });
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error(
          "Access Denied: You do not have permission to access this resource."
        );
      } else {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    }
    return true;
  } catch (error) {
    throw error;
  }
};
