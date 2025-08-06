import { sentUpdateReport } from "@/app/api/reports";
import { createUpdateReport } from "@/app/form/createReport";
import { GetReportBody } from "@/app/types";
import React, { useState } from "react";
import { StatusEnum } from "@/app/status";
import Image from "next/image";

interface Props {
  report: GetReportBody;
}

const SentComponent: React.FC<Props> = ({ report }) => {
  const [details, setDetails] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  function handleDetailsChange(input: string) {
    setDetails(input);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = event.target.files
      ? Array.from(event.target.files)
      : [];
    const imageFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles, ...imageFiles];
      return newFiles.slice(0, 4); // จำกัดแค่ 4 รูป
    });
  }

  async function handleRemoveFile(index: number) {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  }

  async function updateReport() {
    const mappedAssistances = report.reportAssistances.map((a) => ({
      id: a.assistanceType.id,
      name: a.assistanceType.name,
      unit: a.assistanceType.unit,
      quantity: a.quantity,
    }));

    // 1. update report
    const updatedReport = await createUpdateReport(
      report,
      {
        firstName: report.firstName,
        lastName: report.lastName,
        phone: report.mainPhoneNumber,
        alternatePhone: report.reservePhoneNumber,
      },
      mappedAssistances,
      details
    );

    try {
      const result = await sentUpdateReport(updatedReport, files);
      if (!result) {
        alert("อัพเดตไม่สำเร็จ คำขอกำลังดำเนินการณ์");
        return;
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error sending report:", error);
    }

    // 2. update status
    const updatedStatusReport = {
      ...report,
      reportAssistances: report.reportAssistances.map((assistance) => ({
        ...assistance,
        isActive: false,
      })),
      reportStatus: {
        id: 4,
        status: StatusEnum.SUCCESS,
        userOrderingNumber: 4,
        governmentOrderingNumber: 4,
      },
      afterAdditionalDetail: details,
    };

    try {
      const result = await sentUpdateReport(updatedStatusReport, []);
      if (!result) {
        alert("อัพเดตไม่สำเร็จ คำขอกำลังดำเนินการณ์");
        return;
      } else {
        window.location.reload();
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

        <p className="font-medium mt-3 mb-2">
          แนบรูปถ่ายการแก้ไข (สูงสุด 4 รูป)
        </p>
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-80 md:h-96 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-100 relative"
        >
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-2 p-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative flex items-center justify-center border rounded-lg overflow-visible"
              >
                <img
                  src={URL.createObjectURL(file as File)}
                  alt={`Preview ${index + 1}`}
                  className="h-full w-full object-cover"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                />
                <button
                  type="button"
                  className="absolute -top-2 -right-2"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemoveFile(index);
                  }}
                >
                  <Image
                    src="/delete-button.png"
                    alt="Delete"
                    width={30}
                    height={30}
                    priority
                  />
                </button>
              </div>
            ))}
            {Array.from({ length: 4 - files.length }).map((_, index) => (
              <div
                key={`placeholder-${index}`}
                className="flex items-center justify-center border rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  document.getElementById("dropzone-file")?.click();
                }}
              >
                <p className="text-gray-500 text-base">อัปโหลดรูป</p>
              </div>
            ))}
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>

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
