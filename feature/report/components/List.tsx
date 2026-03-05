import { Report } from "@/types/Report";
import ReportCard from "./card/ReportCard";
import { useReportCard } from "./card/hooks/useReportCard";
import { useCallback, useRef, useState } from "react";

interface Props {
  reports: Report[];
  refresh: () => Promise<void>;
}

const PAGE_SIZE = 10;

//todo addcoment
export default function List({ reports, refresh }: Props) {
  const {
    handleDelete,
    handleSentSubmit,
    isPending,
    isExpanded,
    toggleExpand,
  } = useReportCard(refresh);

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const observer = useRef<IntersectionObserver | null>(null);

  const loadMoreRef = useCallback((node: HTMLDivElement | null) => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => prev + PAGE_SIZE);
      }
    });

    if (node) observer.current.observe(node);
  }, []);

  const visibleReports = reports.slice(0, visibleCount);

  return (
    <div className={isPending ? "opacity-50 pointer-events-none" : ""}>
      <div className="flex flex-col items-center p-3">
        {visibleReports.map((report, index) => {
          const isLast = index === visibleReports.length - 1;

          return (
            <div
              key={report.id}
              ref={isLast ? loadMoreRef : null}
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
          );
        })}
      </div>
    </div>
  );
}
