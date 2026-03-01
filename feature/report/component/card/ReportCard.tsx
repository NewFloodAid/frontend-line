"use client";

import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Report } from "@/types/Report";
import { StatusMappingToTH } from "@/constants/report_status";

import ReportCardHeader from "./ReportCardHeader";
import ReportCardBody from "./ReportCardBody";
import ReportCardFooter from "./ReportCardFooter";
import ConfirmModal from "./ConfirmModal";
import SentComponent from "./ExpandedSection/Sent";
import SuccessComponent from "./ExpandedSection/Success";

dayjs.extend(buddhistEra);
dayjs.locale("th");

interface Props {
  /** ข้อมูล report ทั้งหมด */
  report: Report;

  /** สถานะการ expand */
  isExpanded: boolean;

  /** ฟังก์ชันสลับการขยาย (optional หากไม่ส่งมาจะไม่แสดงปุ่ม expand) */
  onToggleExpand?: () => void;

  /** ฟังก์ชันลบ (optional หากไม่ส่งมาจะไม่แสดงปุ่มลบ) */
  onDelete?: (id: number) => void;

  /** ฟังก์ชัน submit สำหรับ section Sent */
  onSentSubmit: (data: {
    report: Report;
    details: string;
    images: File[];
  }) => Promise<void>;
}

/**
 * แปลงวันที่ให้อยู่ในรูปแบบภาษาไทย (พ.ศ.)
 */
const formatThaiDate = (dateStr: string) => {
  const dt = dayjs(dateStr);
  return {
    date: dt.format("D/MM/BB"),
    time: dt.format("HH:mm"),
  };
};

/**
 * ReportCard Component
 * --------------------
 * Component สำหรับแสดงข้อมูล Report หนึ่งรายการ
 *
 * หน้าที่หลัก:
 * - แสดงข้อมูลพื้นฐานของรายงาน (วันที่, เวลา, สถานะ, ประเภทความช่วยเหลือ)
 * - รองรับการขยาย/ย่อรายละเอียด (controlled จาก parent)
 * - เรียกใช้งาน edit / delete ผ่าน callback จาก parent
 * - แสดงส่วนเพิ่มเติมเมื่อขยาย (Sent / Success section)
 *
 * หมายเหตุ:
 * Component นี้ไม่มี business logic ภายใน
 * การลบ การ submit หรือการ refresh ข้อมูล ถูกควบคุมจาก parent ทั้งหมด
 */
export default function ReportCard({
  report,
  isExpanded,
  onToggleExpand,
  onDelete,
  onSentSubmit,
}: Props) {
  const router = useRouter();

  /**
   * state สำหรับควบคุมการแสดง modal ยืนยันการลบ
   */
  const [showModal, setShowModal] = useState(false);

  /**
   * memoize วันที่และเวลา
   * ป้องกันการคำนวณซ้ำทุกครั้งที่ re-render
   */
  const { date, time } = useMemo(
    () => formatThaiDate(report.createdAt),
    [report.createdAt],
  );

  /**
   * ดึงประเภทความช่วยเหลือแรกที่มีจำนวนมากกว่า 0
   */
  const firstAssistance = useMemo(
    () =>
      report.reportAssistances.find((a) => a.quantity > 0)?.assistanceType.name,
    [report.reportAssistances],
  );

  const status = report.reportStatus.status;

  const handleDelete = () => {
    if (!onDelete) return;
    onDelete(report.id);
    setShowModal(false);
  };

  return (
    <>
      {/* ================= ส่วน Header ================= */}
      <ReportCardHeader
        report={report}
        date={date}
        time={time}
        status={status}
        onEdit={() => router.push(`/form?id=${report.id}`)}
        onDelete={onDelete ? () => setShowModal(true) : undefined}
      />

      {/* ================= ส่วน Body ================= */}
      <ReportCardBody
        report={report}
        firstAssistance={firstAssistance}
        isExpanded={isExpanded}
      />

      {/* ================= ส่วนที่แสดงเมื่อขยาย ================= */}
      {isExpanded && (
        <>
          <SentComponent report={report} onSubmit={onSentSubmit} />
          <SuccessComponent report={report} />
        </>
      )}

      {/* ================= ส่วน Footer ================= */}
      <ReportCardFooter
        status={status}
        isExpanded={isExpanded}
        toggleExpand={onToggleExpand}
        statusText={StatusMappingToTH[status]}
      />

      {/* ================= Modal ยืนยันการลบ ================= */}
      {showModal && (
        <ConfirmModal
          id={report.id}
          handleDelete={handleDelete}
          handleCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
}
