import { GetReportBody } from "@/app/types";
import React from "react";
import { StatusEnum } from "@/app/status";

interface AssistancesProps {
  report: GetReportBody;
}

const PendingComponent: React.FC<AssistancesProps> = ({ report }) => {
  return (
    report.reportStatus.status === StatusEnum.PENDING && (
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
