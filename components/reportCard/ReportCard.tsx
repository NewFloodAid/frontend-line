"use client";

import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { TransitionStartFunction, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Report } from "@/types/Report";
import { deleteReport } from "@/api/reports";
import { StatusMappingToTH } from "@/constants/report_status";

import ConfirmModal from "./ConfirmModal";
import SentComponent from "./reportCardSection/Sent";
import SuccessComponent from "./reportCardSection/Success";
import ReportCardMapComponent from "./Map";

dayjs.extend(buddhistEra);
dayjs.locale("th");

const STATUS_COLOR: Record<string, string> = {
  PENDING: "text-red-500",
  PROCESS: "text-orange-500",
  SENT: "text-blue-500",
  SUCCESS: "text-green-500",
};

interface Props {
  report: Report;
  startTransition: TransitionStartFunction;
  fetchReports: () => Promise<void>;
  isExpanded: boolean;
  setExpandedCardId: (id: number | undefined) => void;
}

/* ---------------- utils ---------------- */

const formatThaiDate = (dateStr: string) => {
  const dt = dayjs(dateStr);
  return {
    date: dt.format("D/MM/BB"),
    time: dt.format("HH:mm"),
  };
};

/* ---------------- component ---------------- */

export default function ReportCard({
  report,
  startTransition,
  fetchReports,
  isExpanded,
  setExpandedCardId,
}: Props) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  /* ---------- memoized values ---------- */

  const { date, time } = useMemo(
    () => formatThaiDate(report.createdAt),
    [report.createdAt],
  );

  const firstAssistance = useMemo(
    () =>
      report.reportAssistances.find((assistance) => assistance.quantity > 0)
        ?.assistanceType.name,
    [report.reportAssistances],
  );

  const status = report.reportStatus.status;

  /* ---------- handlers ---------- */

  const handleDelete = async (id: number) => {
    startTransition(async () => {
      await deleteReport(id);
      await fetchReports();
    });
    setShowModal(false);
  };

  const toggleExpand = () => {
    setExpandedCardId(isExpanded ? undefined : report.id);
  };

  /* ---------- render ---------- */

  return (
    <>
      {/* วันที่ + ปุ่ม */}
      <div className="flex justify-between">
        <div className="flex gap-2">
          <span>{date}</span>
          <span>เวลา {time} น.</span>
        </div>

        {status === "PENDING" && (
          <div className="flex gap-3">
            <button onClick={() => router.push(`/form?id=${report.id}`)}>
              <Image
                src="/buttons/edit-button.svg"
                alt="edit"
                width={30}
                height={30}
              />
            </button>

            <button onClick={() => setShowModal(true)}>
              <Image
                src="/buttons/bin.png"
                alt="delete"
                width={25}
                height={25}
              />
            </button>
          </div>
        )}
      </div>

      {/* ผู้แจ้ง */}
      <div className="mt-3 mb-5">
        <span className="mr-2">ผู้แจ้ง</span>
        <span>
          {report.firstName} {report.lastName}
        </span>
      </div>

      {/* รายละเอียด */}
      <div className="mb-4">
        <h3 className="mb-2 font-semibold">{firstAssistance}</h3>
        <p className="ml-3">{report.additionalDetail}</p>
      </div>

      {/* รูป + แผนที่ */}
      <div className="flex gap-2 overflow-x-auto">
        <ReportCardMapComponent report={report} />

        {report.images
          .filter((image) => image.phase === "BEFORE")
          .map((image) => (
            <img
              key={image.id}
              src={image.url}
              alt="report"
              className="h-40 rounded-md shadow-lg"
            />
          ))}
      </div>

      {/* Expanded section */}
      {isExpanded && (
        <>
          <SentComponent
            report={report}
            fetchReports={fetchReports}
            startTransition={startTransition}
          />
          <SuccessComponent report={report} />
        </>
      )}

      {/* Footer */}
      <div className="flex items-center mt-5 pt-2 border-t">
        {status === "SENT" && (
          <button
            onClick={toggleExpand}
            className={`px-4 py-3 rounded-lg text-white transition
              ${
                isExpanded
                  ? "bg-red-400 hover:bg-red-500"
                  : "bg-green-500 hover:bg-green-600"
              }
            `}
          >
            {isExpanded ? "ยกเลิก" : "อัพเดต"}
          </button>
        )}

        {status === "SUCCESS" && (
          <button
            onClick={toggleExpand}
            className="text-gray-700 underline font-semibold"
          >
            {isExpanded ? "ซ่อนรายละเอียด" : "แสดงรายละเอียด"}
          </button>
        )}

        <span className={`ml-auto font-semibold ${STATUS_COLOR[status]}`}>
          {StatusMappingToTH[status]}
        </span>
      </div>

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
