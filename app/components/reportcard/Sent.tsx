import { sentUpdateReport } from "@/app/api/reports";
import { createUpdateReport } from "@/app/form/createReport";
import { GetReportBody } from "@/app/types";
import React, { useState } from "react";
import { StatusEnum } from "@/app/status";

interface AssistancesProps {
  report: GetReportBody;
}

const SentComponent: React.FC<AssistancesProps> = ({ report }) => {
  const [details, setDetails] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  function handleDetailsChange(input: string) {
    setDetails(input);
  }

  async function updateReport() {
    const mappedAssistances = report.reportAssistances.map((a) => ({
      id: a.assistanceType.id,
      name: a.assistanceType.name,
      unit: a.assistanceType.unit,
      quantity: a.quantity,
    }));
    const updateReport = await createUpdateReport(
      report,
      {
        firstName: report.firstName,
        lastName: report.lastName,
        phone: report.mainPhoneNumber,
        alternatePhone: report.reservePhoneNumber,
      },
      mappedAssistances,
      report.additionalDetail,
      details,
      StatusEnum.SUCCESS
    );
    console.log(updateReport);
    try {
      const result = await sentUpdateReport(updateReport, []);
      if (!result) {
        alert("อัพเดตไม่สำเร็จ คำขอกำลังดำเนินการณ์");
        return;
      } else {
        // window.location.href = "/success";
      }
    } catch (error) {
      console.error("Error sending report:", error);
    }
  }

  return (
    report.reportStatus.status === StatusEnum.SENT && (
      <div className="pt-4">
        {/* กล่อง textarea */}
        <div>
          <p className="font-medium mb-1">อัปเดตหลังการแก้ไข</p>
          <textarea
            placeholder="อธิบายเพิ่มเติม..."
            name="afterAdditionalDetail"
            value={details}
            onChange={(e) => handleDetailsChange(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            rows={3}
          />
        </div>

        {/* Checkbox */}
        <div className="mt-4 mb-2 flex items-center justify-center">
          <input
            type="checkbox"
            id="confirm"
            className="mr-2 w-5 h-5 transform scale-100"
            checked={isConfirmed}
            onChange={(e) => setIsConfirmed(e.target.checked)}
          />
          <label htmlFor="confirm" className="text-green-600 text-base">
            แก้ไขแล้ว
          </label>
        </div>

        {/* ปุ่มอัปเดต */}
        <div className="mt-4 mb-2 flex items-center justify-center">
          <button
            className={`px-7 py-2 rounded text-sm ${
              isConfirmed
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!isConfirmed}
            onClick={updateReport}
          >
            อัปเดต
          </button>
        </div>
      </div>
    )
  );
};

export default SentComponent;
