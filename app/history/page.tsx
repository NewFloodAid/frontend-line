"use client";

import { useEffect, useState } from "react";
import { getReports } from "@/api/reports";
import { Report } from "@/types/Report";
import ReportCard from "@/components/reportCard/ReportCard";
import { useRouter } from "next/navigation";

function History() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);

  const fetchReports = async () => {
    const uid = localStorage.getItem("uid");
    if (!uid) {
      router.replace("/");
    } else {
      const data = await getReports(uid);
      setReports(data);
    }
  };

  useEffect(() => {
    fetchReports();

    const interval = setInterval(() => {
      fetchReports();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid auto-rows-min gap-4 min-h-screen bg-[#505050] py-4">
      {reports.map((report, index) => (
        <ReportCard
          key={report.id}
          report={report}
          index={index + 1}
          isExpanded={expandedCardId === report.id}
          onToggleExpand={() =>
            setExpandedCardId(expandedCardId === report.id ? null : report.id)
          }
          fetchReports={fetchReports}
        />
      ))}
    </div>
  );
}

export default History;
