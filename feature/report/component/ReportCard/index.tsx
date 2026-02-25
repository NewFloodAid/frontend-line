"use client";

import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { useMemo, useState, TransitionStartFunction } from "react";
import { useRouter } from "next/navigation";

import { Report } from "@/types/Report";
import { deleteReport } from "@/api/reports";
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
  report: Report;
  startTransition: TransitionStartFunction;
  fetchReports: () => Promise<void>;
  isExpanded: boolean;
  setExpandedCardId: (id: number | undefined) => void;
}

const formatThaiDate = (dateStr: string) => {
  const dt = dayjs(dateStr);
  return {
    date: dt.format("D/MM/BB"),
    time: dt.format("HH:mm"),
  };
};

export default function ReportCard({
  report,
  startTransition,
  fetchReports,
  isExpanded,
  setExpandedCardId,
}: Props) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const { date, time } = useMemo(
    () => formatThaiDate(report.createdAt),
    [report.createdAt],
  );

  const firstAssistance = useMemo(
    () =>
      report.reportAssistances.find((a) => a.quantity > 0)?.assistanceType.name,
    [report.reportAssistances],
  );

  const status = report.reportStatus.status;

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

  return (
    <>
      <ReportCardHeader
        report={report}
        date={date}
        time={time}
        status={status}
        onEdit={() => router.push(`/form?id=${report.id}`)}
        onDelete={() => setShowModal(true)}
      />

      <ReportCardBody
        report={report}
        firstAssistance={firstAssistance}
        isExpanded={isExpanded}
      />

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

      <ReportCardFooter
        status={status}
        isExpanded={isExpanded}
        toggleExpand={toggleExpand}
        statusText={StatusMappingToTH[status]}
      />

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
