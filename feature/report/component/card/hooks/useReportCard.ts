"use client";

import { useState, useTransition } from "react";
import { Report } from "@/types/Report";
import {
  createUpdatedReport,
  createUpdatedStatusReport,
} from "@/feature/report/utils/reportConfig";
import { updateReport, deleteReport } from "@/api/reports";

/**
 * พารามิเตอร์สำหรับการ submit ข้อมูลในส่วน Sent
 */
interface SentSubmitParams {
  report: Report;
  details: string;
  images: File[];
}

/**
 * useReportCard
 * -------------
 * Custom Hook สำหรับจัดการ logic กลางของ ReportCard
 *
 * หน้าที่หลัก:
 * - ควบคุมสถานะ expand / collapse ของ card
 * - จัดการการลบรายงาน
 * - จัดการการ submit (อัปเดตข้อมูล + เปลี่ยนสถานะ)
 * - ควบคุม loading state ผ่าน useTransition
 *
 *
 * @param refresh optional function สำหรับ refresh ข้อมูลหลัง mutation
 */
export function useReportCard(refresh?: () => Promise<void>) {
  const [isPending, startTransition] = useTransition();

  /**
   * เก็บ id ของ card ที่กำลัง expand
   */
  const [expandedCardId, setExpandedCardId] = useState<number | undefined>();

  /**
   * ตรวจสอบว่า card ปัจจุบันถูก expand หรือไม่
   */
  const isExpanded = (id: number) => expandedCardId === id;

  /**
   * สลับสถานะ expand
   */
  const toggleExpand = (id: number) => {
    setExpandedCardId(expandedCardId === id ? undefined : id);
  };

  /**
   * จัดการลบ report
   * - เรียก API ลบ
   * - เรียก refresh หากมีการส่งมา
   * - ทำงานภายใน startTransition เพื่อลดผลกระทบต่อ UX
   */
  const handleDelete = async (id: number) => {
    startTransition(async () => {
      await deleteReport(id);
      if (refresh) await refresh();
    });
  };

  /**
   * จัดการ submit ส่วน Sent
   *
   * flow:
   * 1. สร้าง updatedReport (เพิ่มรายละเอียด)
   * 2. เรียก updateReport พร้อมรูปภาพ
   * 3. สร้าง updatedStatusReport (เปลี่ยนสถานะ)
   * 4. เรียก updateReport อีกครั้งเพื่ออัปเดตสถานะ
   * 5. เรียก refresh (ถ้ามี)
   *
   */
  const handleSentSubmit = async ({
    report,
    details,
    images,
  }: SentSubmitParams) => {
    startTransition(async () => {
      const updatedReport = createUpdatedReport(report, details);
      await updateReport(updatedReport, images);

      const updatedStatusReport = createUpdatedStatusReport(updatedReport);
      await updateReport(updatedStatusReport);

      if (refresh) await refresh();
    });
  };

  return {
    isPending,
    handleDelete,
    handleSentSubmit,
    isExpanded,
    toggleExpand,
  };
}
