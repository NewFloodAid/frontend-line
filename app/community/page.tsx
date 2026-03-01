"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getReports } from "@/api/reports";
import { Report } from "@/types/Report";
import ReportCard from "@/feature/report/component/card/ReportCard";
import { useReportCard } from "@/feature/report/component/card/hooks/useReportCard";

function Community() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [statusFilter, setStatusFilter] = useState<number>(1);

  async function fetchReports() {
    const uid = localStorage.getItem("uid");
    if (!uid) {
      router.replace("/");
      return;
    }

    const data = await getReports({ reportStatusId: statusFilter }, uid);

    setReports(data);
  }

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 5000);
    return () => clearInterval(interval);
  }, [statusFilter]);

  // ✅ ใช้ hook กลางเหมือน History
  const {
    handleDelete,
    handleSentSubmit,
    isPending,
    isExpanded,
    toggleExpand,
  } = useReportCard(fetchReports);

  return (
    <div className={isPending ? "opacity-50 pointer-events-none" : ""}>
      <div className="min-h-screen bg-[#505050]">
        {/* 🔹 Filter */}
        <div className="sticky top-[78px] bg-[#505050] py-3 z-40">
          <div className="flex justify-center">
            <button
              className={`${
                statusFilter === 1
                  ? "bg-blue-500 text-white"
                  : "border border-blue-500 text-blue-500"
              } py-2 px-4 rounded-full mx-3`}
              onClick={() => setStatusFilter(1)}
            >
              หน่วยงานรับเรื่องแล้ว
            </button>

            <button
              className={`${
                statusFilter === 4
                  ? "bg-green-500 text-white"
                  : "border border-green-500 text-green-500"
              } py-2 px-4 rounded-full`}
              onClick={() => setStatusFilter(4)}
            >
              คำขอได้รับการแก้ไข
            </button>
          </div>
        </div>

        {/* 🔹 Card */}
        <div className="flex flex-col items-center p-3 pt-4">
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
    </div>
  );
}

export default Community;
