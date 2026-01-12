"use client";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getReports } from "@/api/reports";
import { Report } from "@/types/Report";
import NewReportCard from "@/components/reportCard/ReportCard";

function Community() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [reports, setReports] = useState<Report[]>([]);
  const [expandedCardId, setExpandedCardId] = useState<number>();

  const [statusFilter, setStatusFilter] = useState<number>(1);

  async function fetchReports() {
    const uid = localStorage.getItem("uid");
    if (!uid) {
      router.replace("/");
    } else {
      const data = await getReports({ reportStatusId: statusFilter }, uid);
      setReports(data);
    }
  }

  useEffect(() => {
    startTransition(async () => {
      await fetchReports();
    });
    const interval = setInterval(() => fetchReports(), 5000);
    return () => clearInterval(interval);
  }, [statusFilter]);

  return (
    <div className={`${isPending ? "pointer-events-none opacity-50" : ""}`}>
      <div className="min-h-screen bg-[#505050]">
        {/* แถบ filter */}
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

        {/* Card */}
        <div className="flex flex-col items-center p-3 pt-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="w-full max-w-2xl bg-white p-5 my-2 shadow-md rounded-lg"
            >
              <NewReportCard
                report={report}
                startTransition={startTransition}
                fetchReports={fetchReports}
                isExpanded={expandedCardId == report.id}
                setExpandedCardId={setExpandedCardId}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Community;
