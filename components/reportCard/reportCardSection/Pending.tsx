"use client";
import React from "react";
import { Report } from "@/types/Report";

interface Props {
  report: Report;
}

const PendingComponent: React.FC<Props> = ({ report }) => {
  return (
    report.reportStatus.status === "PENDING" && (
      <div className="px-6 pt-4">
        {/* ปุ่มแก้ไข */}
        <div className="mt-4 mb-2 flex items-center justify-center">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded text-sm"
            onClick={() => {
              window.location.href = `/form?id=${report.id}`;
            }}
          >
            แก้ไขคำขอ
          </button>
        </div>
      </div>
    )
  );
};

export default PendingComponent;
