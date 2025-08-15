import axiosClient from "@/libs/axios";
import { Report } from "@/types/Report";
import { ReportFormData } from "@/types/ReportFormData";

async function getReports(userId: string) {
  try {
    const res = await axiosClient.get<Report[]>(
      `/reports/filters?priorities=1,2,3,4&userId=${userId}`
    );
    return res.data;
  } catch (err) {
    console.error("Fetch reports failed:", err);
    throw err;
  }
}

async function createReport(report: ReportFormData, images: File[]) {
  const formData = new FormData();
  formData.append("report", JSON.stringify(report));

  images.forEach((image) => {
    formData.append("files", image);
  });

  try {
    const res = await axiosClient.post("/reports", formData);
    return res.data;
  } catch (err) {
    console.error("Create report failed:", err);
    throw err;
  }
}

async function updateReport(report: ReportFormData, images?: File[]) {
  const formData = new FormData();
  formData.append("report", JSON.stringify(report));

  images?.forEach((image) => {
    formData.append("files", image);
  });

  try {
    const res = await axiosClient.put("/reports", formData);
    return res.data;
  } catch (err) {
    console.error("Update report failed:", err);
    throw err;
  }
}

async function deleteReport(id: number) {
  try {
    const res = await axiosClient.delete(`/reports/${id}`);
    return res.data;
  } catch (err) {
    console.error("Update report failed:", err);
    throw err;
  }
}

export { getReports, createReport, updateReport, deleteReport };
