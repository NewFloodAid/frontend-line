import { Report } from "@/types/Report";
import { useReportCard } from "../component/card/hooks/useReportCard";
import ReportCard from "../component/card/ReportCard";
import FormCardLayout from "./FormCardLayout";
import { useRouter } from "next/navigation";

interface Props {
  report: Report;
}

export default function UpdateReport({ report }: Props) {
  const router = useRouter();
  const reportCard = useReportCard(async () => {
    router.refresh();
  });

  return (
    <FormCardLayout isPending={reportCard.isPending}>
      <ReportCard
        report={report}
        isExpanded={true}
        onSentSubmit={reportCard.handleSentSubmit}
      />
    </FormCardLayout>
  );
}
