"use client";
import React from "react";

interface CustomPopupProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  type: popupType;
}

export const enum popupType {
  Delete = "REJECT",
  Cancel = "PENDING",
  NOTFOUND = "NOTFOUND",
}

const popupConfig: Record<
  popupType,
  { title: string; message: string; buttonText: string; buttonColor: string }
> = {
  [popupType.Delete]: {
    title: "ลบคำร้องขอ",
    message: "คำร้องขอกำลังดำเนินการ!!!",
    buttonText: "ใช่",
    buttonColor: "bg-red-500",
  },
  [popupType.Cancel]: {
    title: "ยกเลิกคำร้องขอ",
    message: "คำร้องขอกำลังดำเนินการ!!!",
    buttonText: "ใช่",
    buttonColor: "bg-red-500",
  },
  [popupType.NOTFOUND]: {
    title: "ไม่พบคำขอ",
    message: "คำร้องขออาจถูกปฏิเสธ",
    buttonText: "ตกลง",
    buttonColor: "bg-blue-500",
  },
};

const CustomPopup: React.FC<CustomPopupProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  type,
}) => {
  if (!isOpen) return null; // ถ้าไม่เปิดก็ไม่แสดงอะไร

  const handlePopupClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // ป้องกันไม่ให้การคลิกส่งผ่านไปยังการ์ด
  };

  const { title, message, buttonText, buttonColor } = popupConfig[type];
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handlePopupClick}
    >
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full text-center">
        <p className="mt-10 text-red-600 font-bold text-sm">{message}</p>
        <h2 className="text-2xl font-bold mt-1">{title}</h2>
        <div className="mt-6 mb-10 flex justify-center space-x-4">
          <button
            className={`px-6 py-3 text-white rounded-2xl text-lg font-bold shadow-lg ${buttonColor}`}
            onClick={onConfirm}
          >
            {buttonText}
          </button>
          {type !== popupType.NOTFOUND && (
            <button
              className="px-6 py-3 bg-gray-100 text-black rounded-2xl text-lg font-bold shadow-lg"
              onClick={onCancel}
            >
              ไม่
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomPopup;
