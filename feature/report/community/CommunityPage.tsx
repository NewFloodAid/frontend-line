"use client";

import { useState } from "react";
import { useReports } from "../hooks/useReports";
import ReportList from "../components/List";
import StatusFilter from "../components/StatusFilter";

export default function CommunityPage() {
  const [statusFilter, setStatusFilter] = useState(1);

  const { reports, fetchReports } = useReports({
    reportStatusId: statusFilter,
    autoRefresh: 10,
  });

  return (
    <div className="min-h-screen bg-[#505050]">
      <StatusFilter value={statusFilter} onChange={setStatusFilter} />
      <ReportList reports={reports} refresh={fetchReports} />
    </div>
  );
}
