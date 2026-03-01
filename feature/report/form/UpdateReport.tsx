import { Report } from "@/types/Report";
import { useReportCard } from "../component/ReportCard/hooks/useReportCard";
import ReportCard from "../component/ReportCard/ReportCard";
import FormCardLayout from "./FormCardLayout";

interface Props {
  report: Report;
}

export default function UpdateReport({ report }: Props) {
  const reportCard = useReportCard();

  return (
    <FormCardLayout isPending={reportCard.isPending}>
      <ReportCard
        report={report}
        isExpanded={reportCard.isExpanded(report.id)}
        onToggleExpand={() => reportCard.toggleExpand(report.id)}
        onSentSubmit={reportCard.handleSentSubmit}
      />
    </FormCardLayout>
  );
}
