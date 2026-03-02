"use client";

import { useReports } from "../hooks/useReports";
import ReportList from "../components/List";

export default function HistoryPage({ uid }: { uid: string }) {
  const { reports, fetchReports } = useReports({
    userId: uid,
    autoRefresh: 10,
  });

  return (
    <div className="min-h-screen bg-[#505050]">
      <ReportList reports={reports} refresh={fetchReports} />
    </div>
  );
}
