import { Report } from "@/types/Report";
import { useReportCard } from "../components/card/hooks/useReportCard";
import ReportCard from "../components/card/ReportCard";
import FormCardLayout from "./FormCardLayout";
import { getReportById } from "@/api/reports";
import { useEffect, useState } from "react";

interface Props {
  report: Report;
}

export default function UpdateReport({ report }: Props) {
  const [currentReport, setCurrentReport] = useState(report);

  useEffect(() => {
    setCurrentReport(report);
  }, [report]);

  const reportCard = useReportCard(async () => {
    const uid = typeof window !== "undefined" ? localStorage.getItem("uid") : null;
    if (!uid) return;

    const latestReport = await getReportById(report.id, uid);
    if (latestReport) {
      setCurrentReport(latestReport);
    }
  });

  return (
    <FormCardLayout isPending={reportCard.isPending}>
      <ReportCard
        report={currentReport}
        isExpanded={true}
        onSentSubmit={reportCard.handleSentSubmit}
      />
    </FormCardLayout>
  );
}
