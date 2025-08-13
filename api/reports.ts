import api from "@/libs/axios";
import { Report } from "@/types/Report";
import { ReportFormData } from "@/types/ReportFormData";

async function getReports(userId: string) {
  const jwtToken = localStorage.getItem("jwtToken");
  const res = await api.get<Report[]>(
    `/reports/filters?priorities=1,2,3,4&userId=${userId}`,
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "X-Source-App": "LIFF",
      },
    }
  );
  return res.data;
}

async function createReport(report: ReportFormData, images: File[]) {
  const jwtToken = localStorage.getItem("jwtToken");
  if (!jwtToken) {
    throw new Error("User is not authenticated.");
  }

  const formData = new FormData();

  formData.append("report", JSON.stringify(report));

  images.forEach((image) => {
    formData.append("files", image);
  });

  await api
    .request({
      url: "/reports",
      method: "post",
      data: formData,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "X-Source-App": "LIFF",
      },
    })
    .catch((err) => console.error(err));
}

async function updateReport(report: ReportFormData, images?: File[]) {
  const jwtToken = localStorage.getItem("jwtToken");
  if (!jwtToken) {
    throw new Error("User is not authenticated.");
  }

  const formData = new FormData();

  formData.append("report", JSON.stringify(report));

  images?.forEach((image) => {
    formData.append("files", image);
  });

  await api
    .request({
      url: "/reports",
      method: "put",
      data: formData,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "X-Source-App": "LIFF",
      },
    })
    .catch((err) => console.error(err));
}

async function deleteReport(id: number) {
  const jwtToken = localStorage.getItem("jwtToken");
  if (!jwtToken) {
    throw new Error("User is not authenticated.");
  }
  await api
    .request({
      url: `/reports/${id}`,
      method: "delete",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "X-Source-App": "LIFF",
      },
    })
    .catch((err) => console.error(err));
}

export { getReports, createReport, updateReport, deleteReport };
