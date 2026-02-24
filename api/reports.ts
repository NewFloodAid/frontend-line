import axiosClient from "@/libs/axios";
import { GetReportsQueryParams, Report } from "@/types/Report";
import { ReportFormData } from "@/types/ReportFormData";

/**
 * ดึงข้อมูลรายงาน (Report) จาก backend ตามเงื่อนไขที่กำหนด
 *
 * @param params - เงื่อนไขสำหรับ filter รายงาน
 * @param uid - รหัสผู้ใช้ (ใช้สำหรับยืนยันตัวตน user)
 * @returns Promise ที่ resolve เป็น array ของ Report
 * @throws Error เมื่อเรียก API ไม่สำเร็จ
 */
async function getReports(params?: GetReportsQueryParams, uid?: string) {
  try {
    const res = await axiosClient.get<Report[]>("/reports/filters", {
      params,
      headers: { "X-User-Id": uid },
    });
    return res.data;
  } catch (err) {
    console.error("Fetch reports failed:", err);
    throw err;
  }
}

/**
 * ดึงข้อมูลรายงาน (Report) จาก backend ตาม id ของ report
 *
 * @param id - id ของรายงาน
 * @param uid - รหัสผู้ใช้ (ใช้สำหรับยืนยันตัวตน user)
 * @returns Promise ที่ resolve เป็น Report
 * @throws Error เมื่อเรียก API ไม่สำเร็จ
 */
async function getReportById(id: string | number, uid?: string) {
  try {
    const reports = await getReports(undefined, uid);
    return reports.find((report) => report.id == id);
  } catch (err) {
    console.error("Fetch reports failed:", err);
    throw err;
  }
}

/**
 * สร้างรายงานใหม่ พร้อมแนบรูปภาพ
 *
 * @param report - ข้อมูลรายงานจากฟอร์ม
 * @param images - ไฟล์รูปภาพที่ต้องการแนบกับรายงาน
 * @returns Promise ที่ resolve เป็นข้อมูลรายงานที่ถูกสร้างจาก backend
 * @throws Error เมื่อเรียก API ไม่สำเร็จ
 */
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

/**
 * แก้ไขรายงาน พร้อมแนบรูปภาพ
 *
 * @param report - ข้อมูลรายงานจากฟอร์ม
 * @param images - ไฟล์รูปภาพที่ต้องการแนบกับรายงาน
 * @returns Promise ที่ resolve เป็นข้อมูลรายงานที่ถูกสร้างจาก backend
 * @throws Error เมื่อเรียก API ไม่สำเร็จ
 */
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

/**
 * ลบรายงาน
 *
 * @param id - id ของรายงาน
 * @throws Error เมื่อเรียก API ไม่สำเร็จ
 */
async function deleteReport(id: number) {
  await axiosClient.delete(`/reports/${id}`).catch((err) => {
    console.error("Delete report failed:", err);
    throw err;
  });
}

export { getReports, getReportById, createReport, updateReport, deleteReport };
