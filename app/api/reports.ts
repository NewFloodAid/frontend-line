import axios from "axios";
import * as Types from "@/app/types";

const URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/reports`;

export async function sendReport(
  report: Types.CreateReportBody,
  photos: File[]
) {
  try {
    const formData = new FormData();
    const jwtToken = localStorage.getItem("jwtToken");

    if (!jwtToken) {
      throw new Error("User is not authenticated.");
    }

    formData.append("report", JSON.stringify(report));

    photos.forEach((file) => {
      formData.append("files", file);
    });

    const response = await fetch(URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "X-Source-App": "LIFF",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`status: ${response.status}`);
    }

    // const result = await response.json();
    // console.log("Response from backend:", result);
  } catch (error) {
    console.error("Error sending help request:", error);
    throw error;
  }
}

export async function getReport(userId: string) {
  try {
    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) {
      throw new Error("User is not authenticated.");
    }

    const response = await axios.get<Types.GetReportBody[]>(
      `${URL}/filters?priorities=1,2,3,4&userId=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "X-Source-App": "LIFF",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
}

export async function sentUpdateReport(
  report: Types.GetReportBody,
  photos: File[]
) {
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
    const response = await fetch(URL, {
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
}

export async function deleteReport(userId: string, reportId: number) {
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
}

async function deleteApi(reportId: number) {
  try {
    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) {
      throw new Error("User is not authenticated.");
    }
    const response = await fetch(`${URL}/${reportId}`, {
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
}
