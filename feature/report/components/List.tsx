import { Report } from "@/types/Report";
import ReportCard from "./card/ReportCard";
import { useReportCard } from "./card/hooks/useReportCard";

interface Props {
  reports: Report[];
  refresh: () => Promise<void>;
}

export default function List({ reports, refresh }: Props) {
  const {
    handleDelete,
    handleSentSubmit,
    isPending,
    isExpanded,
    toggleExpand,
  } = useReportCard(refresh);

  return (
    <div className={isPending ? "opacity-50 pointer-events-none" : ""}>
      <div className="flex flex-col items-center p-3">
        {reports.map((report) => (
          <div
            key={report.id}
            className="w-full max-w-2xl bg-white p-5 my-2 shadow-md rounded-lg"
          >
            <ReportCard
              report={report}
              isExpanded={isExpanded(report.id)}
              onToggleExpand={() => toggleExpand(report.id)}
              onDelete={handleDelete}
              onSentSubmit={handleSentSubmit}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
