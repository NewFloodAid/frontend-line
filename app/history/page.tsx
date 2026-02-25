"use client";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getReports } from "@/api/reports";
import { Report } from "@/types/Report";
import ReportCard from "@/feature/report/component/ReportCard/index";

function History() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [reports, setReports] = useState<Report[]>([]);
  const [expandedCardId, setExpandedCardId] = useState<number>();

  async function fetchReports() {
    const uid = localStorage.getItem("uid");
    if (!uid) {
      router.replace("/");
    } else {
      const data = await getReports({ userId: uid }, uid);
      setReports(data);
    }
  }

  useEffect(() => {
    startTransition(async () => {
      await fetchReports();
    });
    const interval = setInterval(() => fetchReports(), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`${isPending ? "pointer-events-none opacity-50" : ""}`}>
      <div className="flex flex-col items-center min-h-screen bg-[#505050] p-3">
        {reports.map((report) => {
          return (
            <div
              className="w-full max-w-2xl bg-white p-5 my-2 shadow-md rounded-lg"
              key={report.id}
            >
              <ReportCard
                report={report}
                startTransition={startTransition}
                fetchReports={fetchReports}
                isExpanded={expandedCardId == report.id}
                setExpandedCardId={setExpandedCardId}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default History;
