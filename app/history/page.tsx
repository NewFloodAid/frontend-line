"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/providers/userContext";
import ReportCard from "@/app/components/ReportCard";
import { getReport } from "@/app/api/reports";
import { GetReportBody } from "../types";

const History = () => {
  const user = useUser();
  const [reports, setReports] = useState<GetReportBody[]>([]);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 10000); // อัพเดตทุกๆ 10 วินาที
    return () => clearInterval(interval);
  }, [user?.uid]);

  const fetchReports = async () => {
    try {
      if (user?.uid) {
        const data = await getReport(user.uid);
        setReports(data);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    }
  };

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
        />
      ))}
    </div>
  );
};

export default History;
