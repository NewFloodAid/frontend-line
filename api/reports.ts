import axiosClient from "@/libs/axios";
import { Report } from "@/types/Report";
import { ReportFormData } from "@/types/ReportFormData";

function buildParams(params: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v != null)
  );
}

async function getReports(filters?: {
  userId?: string;
  reportStatusId?: number;
}) {
  try {
    const res = await axiosClient.get<Report[]>("/reports/filters", {
      params: buildParams({
        priorities: "1,2,3,4",
        ...filters,
      }),
    });
    return res.data;
  } catch (err) {
    console.error("Fetch reports failed:", err);
    throw err;
  }
}

async function getReportById(id: string | number) {
  try {
    const res = await axiosClient.get<Report>(`/reports/${id}`);
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 404) {
      return null;
    }
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
  await axiosClient.delete(`/reports/${id}`).catch((err) => {
    console.error("Delete report failed:", err);
    throw err;
  });
}

export { getReports, getReportById, createReport, updateReport, deleteReport };
