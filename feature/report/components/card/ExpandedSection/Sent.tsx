"use client";

import React, { useEffect, useRef, useState } from "react";
import { Report } from "@/types/Report";
import Image from "next/image";
import imageCompression from "browser-image-compression";

interface Props {
  report: Report;
  onSubmit: (data: {
    report: Report;
    details: string;
    images: File[];
  }) => Promise<void>;
}

const SentComponent: React.FC<Props> = ({ report, onSubmit }) => {
  const MAX_IMAGES = 4;

  const [details, setDetails] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const heicConverterRef = useRef<
    | ((options: { blob: Blob; toType: string }) => Promise<Blob | Blob[]>)
    | null
  >(null);

  useEffect(() => {
    const objectUrls = images.map((file) => URL.createObjectURL(file));
    setImagePreviews(objectUrls);

    return () => {
      objectUrls.forEach(URL.revokeObjectURL);
    };
  }, [images]);

  const inputRef = useRef<HTMLInputElement>(null);

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  const getHeicConverter = async () => {
    if (heicConverterRef.current) return heicConverterRef.current;

    const module = await import("heic2any");
    const converter =
      (module.default as (options: {
        blob: Blob;
        toType: string;
      }) => Promise<Blob | Blob[]>) ?? null;

    heicConverterRef.current = converter;
    return converter;
  };

  const convertHeicToJpeg = async (file: File): Promise<File> => {
    const isHeic =
      file.type === "image/heic" ||
      file.type === "image/heif" ||
      file.name.toLowerCase().endsWith(".heic");

    if (!isHeic || typeof window === "undefined") {
      return file;
    }

    const heic2any = await getHeicConverter();
    if (!heic2any) {
      return file;
    }

    const converted = await heic2any({
      blob: file,
      toType: "image/jpeg",
    });

    const blob = Array.isArray(converted) ? converted[0] : converted;

    return new File([blob as Blob], file.name.replace(/\.heic$/i, ".jpg"), {
      type: "image/jpeg",
    });
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    setCompressing(true);

    try {
      const filesArray = Array.from(e.target.files);
      const compressedFiles = await Promise.all(
        filesArray.map(async (file) => {
          const converted = await convertHeicToJpeg(file);

          return imageCompression(converted, {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1280,
            useWebWorker: true,
            fileType: "image/jpeg",
            initialQuality: 0.6,
            onProgress: (p) => setProgress(p),
          });
        }),
      );

      setImages((prev) => {
        const availableSlots = Math.max(0, MAX_IMAGES - prev.length);
        const filesToAdd = compressedFiles.slice(0, availableSlots);
        return [...prev, ...filesToAdd];
      });
    } finally {
      setCompressing(false);
      e.target.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleUpdateReport = async () => {
    if (!isConfirmed || isSubmitting || compressing) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        report,
        details,
        images,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (report.reportStatus.status !== "SENT") {
    return null;
  }

  return (
    <div className="pt-4">
      <div>
        <p className="font-medium mb-1">อัปเดตหลังการแก้ไข</p>
        <textarea
          placeholder="อธิบายเพิ่มเติม..."
          name="afterAdditionalDetail"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="additional"
          rows={3}
        />
      </div>

      <label className="my-2">แนบรูปถ่ายสถานการณ์ (สูงสุด 4 รูป)</label>
      <button
        type="button"
        onClick={openFileDialog}
        className="upload-image-button"
      >
        <Image src="/icons/upload-icon.svg" alt="icon" width={30} height={30} />
      </button>
      <input
        ref={inputRef}
        multiple
        onChange={onFileChange}
        className="sr-only"
        type="file"
        accept="image/*"
      />

      {compressing && (
        <div className="text-sm text-gray-500">กำลังเตรียมรูป... {progress}%</div>
      )}

      <div className="grid grid-cols-2 gap-3 mt-3">
        {imagePreviews.map((src, i) => (
          <div
            key={`new-${i}`}
            className="relative h-32 border rounded overflow-hidden"
          >
            <img src={src} alt={`new-${i}`} className="w-full h-full object-cover" />
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

      <div className="mt-4 mb-2 flex items-center justify-center">
        <button
          className={`w-full ${
            !isConfirmed || isSubmitting || compressing
              ? "disable-button"
              : "confirm-button"
          }`}
          disabled={!isConfirmed || isSubmitting || compressing}
          onClick={handleUpdateReport}
        >
          {isSubmitting ? "กำลังอัปเดต..." : "อัปเดต"}
        </button>
      </div>
    </div>
  );
};

export default SentComponent;
