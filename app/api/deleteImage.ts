import { getReport, GetReportBody } from "./getReport";
const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/images`;

export const deleteImageApi = async (id: number, report: GetReportBody) => {
  try {
    const data = await getReport(report.userId);
    const foundReport = data.find((item) => item.id === report?.id);
    if (foundReport?.reportStatus.status == "PENDING") {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        // console.log(`Image deleted successfully, status: ${response.status}`);
        return;
      }
      throw new Error(`Failed to delete image, status: ${response.status}`);
    } else {
      return;
    }
  } catch (error) {
    console.error("Failed to delete image via API:", error);
    return false;
  }
};
