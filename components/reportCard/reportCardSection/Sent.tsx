"use client";
import React, {
  TransitionStartFunction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Report } from "@/types/Report";
import Image from "next/image";
import {
  createUpdatedReport,
  createUpdatedStatusReport,
} from "@/feature/utils/reportConfig";
import { updateReport } from "@/api/reports";

interface Props {
  report: Report;
  fetchReports: () => Promise<void>;
  startTransition: TransitionStartFunction;
}

const SentComponent: React.FC<Props> = ({
  report,
  fetchReports,
  startTransition,
}) => {
  const [details, setDetails] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // render รูป
  useEffect(() => {
    const objectUrls = images.map((file) => URL.createObjectURL(file));
    setImagePreviews(objectUrls);

    return () => {
      objectUrls.forEach(URL.revokeObjectURL);
    };
  }, [images]);

  function handleDetailsChange(input: string) {
    setDetails(input);
  }

  // ปุ่มอัพรูป
  const inputRef = useRef<HTMLInputElement>(null);
  const openFileDialog = () => {
    inputRef.current?.click();
  };

  // function อัพรูป
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);

    setImages((prev) => {
      const availableSlots = 4;
      const filesToAdd = filesArray.slice(0, availableSlots);

      return [...prev, ...filesToAdd];
    });

    e.target.value = "";
  };

  // function ลบรูป
  function handleRemoveFile(index: number) {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  }

  function handleUpdateReport() {
    startTransition(async () => {
      // 1. update report
      const updatedReport = createUpdatedReport(report, details);
      await updateReport(updatedReport, images);

      // 2. update status
      const updatedStatusReport = createUpdatedStatusReport(updatedReport);
      await updateReport(updatedStatusReport);

      fetchReports();
    });
  }

  return (
    report.reportStatus.status === "SENT" && (
      <div className="pt-4">
        {/* กล่อง textarea */}
        <div>
          <p className="font-medium mb-1">อัปเดตหลังการแก้ไข</p>
          <textarea
            placeholder="อธิบายเพิ่มเติม..."
            name="afterAdditionalDetail"
            value={details}
            onChange={(e) => handleDetailsChange(e.target.value)}
            className="additional "
            rows={3}
          />
        </div>

        {/* ปุ่มอัพรูป */}
        <label className="my-2">แนบรูปถ่ายสถานการณ์ (สูงสุด 4 รูป)</label>
        <button
          type="button"
          onClick={openFileDialog}
          className="upload-image-button"
        >
          <Image
            src="/icons/upload-icon.svg"
            alt="icon"
            width={30}
            height={30}
          />
        </button>
        <input
          ref={inputRef}
          multiple
          onChange={onFileChange}
          className="sr-only"
          type="file"
        />

        {/* พรีวิวรูปที่อัปโหลด */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          {imagePreviews.map((src, i) => (
            <div
              key={"new-" + i}
              className="relative h-32 border rounded overflow-hidden"
            >
              <img
                src={src}
                alt={`new-${i}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveFile(i)}
                className="absolute top-0 right-0"
              >
                <Image
                  src="/buttons/delete-button.png"
                  alt="icon"
                  width={20}
                  height={20}
                />
              </button>
            </div>
          ))}
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
            className={`w-full ${
              !isConfirmed ? "disable-button" : "confirm-button"
            }`}
            disabled={!isConfirmed}
            onClick={handleUpdateReport}
          >
            อัปเดต
          </button>
        </div>
      </div>
    )
  );
};

export default SentComponent;
