"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/providers/userContext";
import ReportCard from "@/app/components/ReportCard";
import { getReport, GetReportBody } from "@/app/api/getReport";

const History = () => {
  const user = useUser();
  const [reports, setReports] = useState<GetReportBody[]>([]);

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-min gap-4 min-h-screen bg-[#505050] py-4">
      {reports.map((report, index) => (
        <ReportCard key={report.id} report={report} index={index + 1} />
      ))}
    </div>
  );
};

export default History;
