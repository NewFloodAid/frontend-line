"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getReports } from "@/api/reports";
import { Report } from "@/types/Report";
import ReportCard from "@/feature/report/component/ReportCard/ReportCard";
import { useReportCard } from "@/feature/report/component/ReportCard/hooks/useReportCard";

export default function History() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);

  async function fetchReports() {
    const uid = localStorage.getItem("uid");
    if (!uid) {
      router.replace("/");
      return;
    }

    const data = await getReports({ userId: uid }, uid);
    setReports(data);
  }

  useEffect(() => {
    fetchReports();
  }, []);

  const {
    handleDelete,
    handleSentSubmit,
    isPending,
    isExpanded,
    toggleExpand,
  } = useReportCard(fetchReports);

  return (
    <div className={isPending ? "opacity-50 pointer-events-none" : ""}>
      <div className="flex flex-col items-center min-h-screen bg-[#505050] p-3">
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
