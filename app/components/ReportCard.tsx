import Image from "next/image";
import { deleteReport, updateReportStatus } from "@/app/api/reports";
import { GetReportBody } from "../types";
import CustomPopup, { popupType } from "./CustomPopup";
import { useState } from "react";
import { statusMapping } from "../status";

type ReportCardProps = {
  report: GetReportBody;
  index: number;
  onStatusUpdate?: () => void;
};

const ReportCard: React.FC<ReportCardProps> = ({ report, index, onStatusUpdate }) => {
  const uid = report.userId;
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [reportIdToDelete, setReportIdToDelete] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const createdAt = new Date(report.createdAt);

  const status = report.reportStatus.status;
  const title = statusMapping(status);

  const formattedDate = createdAt.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  const formattedTime =
    createdAt.toLocaleTimeString("th-TH", {
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    }) + " น.";

  const handleDelete = async (reportId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setReportIdToDelete(reportId); // เก็บ reportId ที่จะลบ
    setIsPopupOpen(true); // เปิดป๊อปอัปยืนยัน
  };

  const handleConfirmDelete = async () => {
    if (reportIdToDelete === null) return;
    try {
      const result = await deleteReport(uid, reportIdToDelete);
      if (!result) {
        return;
      }
    } catch (e) {
      console.error("Failed to delete report:", e);
    } finally {
      window.location.href = "/history";
    }
  };

  const handleCancelDelete = () => {
    setIsPopupOpen(false);
  };

  const handleCardClick = (id: number) => {
    window.location.href = `/form?id=${id}`;
  };

  const handleUpdateStatus = async (event: React.MouseEvent) => {
    event.stopPropagation();
    if (report.reportStatus.status !== "SENT") return;
    
    setIsUpdating(true);
    try {
      // 1: Add the solved.png image with current SENT status (phase will be AFTER)
      const response = await fetch('/solved.png');
      const blob = await response.blob();
      const solvedImage = new File([blob], 'solved.png', { type: 'image/png' });
      
      // Create FormData with current report status (SENT) and image
      const formData = new FormData();
      formData.append("report", JSON.stringify(report));
      formData.append("files", solvedImage);
      
      const jwtToken = localStorage.getItem("jwtToken");
      if (!jwtToken) {
        throw new Error("User is not authenticated.");
      }

      const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/reports`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "X-Source-App": "LIFF",
        },
        body: formData,
      });

      if (!apiResponse.ok) {
        throw new Error(`status: ${apiResponse.status}`);
      }

      // Step 2: Update status to SUCCESS
      const updatedReport = {
        ...report,
        reportAssistances: report.reportAssistances.map(assistance => ({
          ...assistance,
          isActive: false
        })),
        reportStatus: {
          id: 4,
          status: "SUCCESS",
          userOrderingNumber: 4,
          governmentOrderingNumber: 4
        },
        afterAdditionalDetail: "This is tested feedback"
      };
      
      // Update status to SUCCESS
      await updateReportStatus(updatedReport);
      
      if (onStatusUpdate) {
        onStatusUpdate();
      }
    } catch (error) {
      console.error("Failed to update report status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      className="h-auto w-full rounded-2xl overflow-hidden shadow-lg bg-white mb-4 relative cursor-pointer"
      onClick={() => handleCardClick(report.id)}
    >
      {/* ปุ่มลบการ์ด */}
      {report.reportStatus.status == "PENDING" && (
        <button
          className="absolute top-2 right-2 z-10"
          title="ลบคำร้อง"
          onClick={(e) => handleDelete(report.id, e)}
        >
          <Image
            src="/delete-button.png"
            alt="Delete"
            width={30}
            height={30}
            priority
          />
        </button>
      )}

      {/* ป๊อปอัปยืนยันการลบ */}
      <CustomPopup
        isOpen={isPopupOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        type={report.reportStatus.status as popupType}
      />

      <div className="px-6 py-4">
        <div className="flex justify-between items-center text-base mb-2 relative">
          <span className="text-left">คำร้องที่ {index}</span>
          <div className="flex gap-4 mr-5">
            <span className="text-center">{formattedDate}</span>
            <span className="text-right">เวลา {formattedTime}</span>
          </div>
        </div>
      </div>

      <div className="px-6 flex gap-4 items-start">
        {/* ส่วนข้อมูลความช่วยเหลือ */}
        <div className="flex-1">
          {report.reportAssistances.map(
            (assistance, index) =>
              assistance.quantity > 0 && (
                <div
                  key={index}
                  className={`text-base ${
                    assistance.isActive ? "text-gray-800" : "text-green-600"
                  }`}
                >
                  <p className="text-base font-medium py-2">
                    {assistance.assistanceType.name}
                  </p>
                  <p className="pl-3">
                    จำนวน {assistance.quantity} {assistance.assistanceType.unit}
                  </p>
                </div>
              )
          )}
        </div>

        {/* ส่วนรูปภาพ */}
        <div className="w-32 h-32 bg-gray-200 rounded overflow-hidden">
          {report.images && report.images.length > 0 ? (
            <img
              src={report.images[0].url} // ดึงรูปแรกใน array
              alt="Report Assistance"
              className="object-cover w-full h-full"
            />
          ) : (
            <p className="text-gray-500 text-sm flex items-center justify-center h-full">
              ไม่มีรูปภาพ
            </p>
          )}
        </div>
      </div>

      {/* แสดงรายละเอียดเพิ่มเติม */}
      {report.additionalDetail && (
        <div className="px-6 py-2 text-gray-700 text-base">
          <p className="text-base text-black font-medium py-2">
            รายละเอียดสถานการณ์
          </p>
          <p className="pl-3">{report.additionalDetail}</p>
        </div>
      )}

      <div className="px-6 py-4 flex justify-end">
        <p className={`text-lg font-medium ${title.color}`}>{title.label}</p>
      </div>
            <div className="px-6 py-4 flex justify-between items-center">
        {/* Update to SUCCESS button */}
        {report.reportStatus.status === "SENT" && (
          <button
            className={`px-4 py-2 rounded-lg text-white font-medium text-sm transition-colors ${
              isUpdating 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-green-500 hover:bg-green-600"
            }`}
            onClick={handleUpdateStatus}
            disabled={isUpdating}
          >
            update
          </button>
        )}
        </div>
      {/* <div>{report.id}</div> */}
    </div>
  );
};

export default ReportCard;
