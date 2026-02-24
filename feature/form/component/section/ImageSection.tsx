import { ReportImage } from "@/types/Report";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import heic2any from "heic2any";
import { FormMode } from "@/types/FormMode";

interface ImageSectionProps {
  mode: FormMode;
  onImagesChange: (files: File[]) => void;
  deletedImageIds: number[];
  setDeletedImageIds: (numbers: number[]) => void;
  initialImages?: ReportImage[];
}

export default function ImageSection({
  mode,
  onImagesChange,
  deletedImageIds,
  setDeletedImageIds,
  initialImages = [],
}: ImageSectionProps) {
  const MAX_IMAGES = 4;

  const [newImages, setNewImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  const [compressing, setCompressing] = useState(false);
  const [progress, setProgress] = useState(0);

  // render รูป
  useEffect(() => {
    const objectUrls = newImages.map((file) => URL.createObjectURL(file));
    setNewImagePreviews(objectUrls);

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newImages]);

  useEffect(() => {
    setImageUrls(initialImages.map((image) => image.url));
  }, [initialImages]);

  // แปลงไฟล์ HEIC ของ iphone
  const convertHeicToJpeg = async (file: File): Promise<File> => {
    const isHeic =
      file.type === "image/heic" ||
      file.type === "image/heif" ||
      file.name.toLowerCase().endsWith(".heic");

    if (!isHeic) return file;

    const blob = await heic2any({
      blob: file,
      toType: "image/jpeg",
    });

    return new File([blob as Blob], file.name.replace(/\.heic$/i, ".jpg"), {
      type: "image/jpeg",
    });
  };

  // อัพเดตรูปที่อัพ
  useEffect(() => {
    onImagesChange(newImages);
  }, [newImages, onImagesChange]);

  // function อัพรูป
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

      setNewImages((prev) => {
        const totalExisting = imageUrls.length + prev.length;
        const availableSlots = MAX_IMAGES - totalExisting;

        if (availableSlots <= 0) {
          e.target.value = "";
          return prev;
        }

        const filesToAdd = compressedFiles.slice(0, availableSlots);

        return [...prev, ...filesToAdd];
      });

      e.target.value = "";
    } finally {
      setCompressing(false);
    }
  };

  // function ลบรูปเก่า
  const handleRemoveOldImage = (index: number) => {
    const newDeletedIds = [...deletedImageIds, initialImages[index].id];
    setDeletedImageIds(newDeletedIds);
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // function ลบรูปใหม่
  const handleRemoveNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ปุ่มอัพรูป
  const inputRef = useRef<HTMLInputElement>(null);
  const openFileDialog = () => {
    inputRef.current?.click();
  };

  return (
    <section>
      <label className="my-2 block">
        แนบรูปถ่ายสถานการณ์ หรือบริเวณโดยรอบ (สูงสุด 4 รูป)
        <span className="text-red-500">*</span>
      </label>

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
        <div className="text-sm text-gray-500">
          กำลังเตรียมรูป... {progress}%
        </div>
      )}

      <div className="mt-3">
        {/* แสดงรูปเก่า (URL) */}
        {imageUrls.map((url, i) => (
          <div
            key={"old-" + i}
            className="relative border rounded overflow-hidden mb-3"
          >
            <img src={url} alt={`old-${i}`} className="w-full object-cover" />
            {mode !== "VIEW" && (
              <button
                type="button"
                onClick={() => handleRemoveOldImage(i)}
                className="absolute top-0 right-0"
              >
                <Image
                  src="/buttons/delete-button.png"
                  alt="icon"
                  width={20}
                  height={20}
                />
              </button>
            )}
          </div>
        ))}

        {/* แสดงรูปใหม่ (File) */}
        {newImagePreviews.map((src, i) => (
          <div
            key={"new-" + i}
            className="relative border rounded overflow-hidden mb-3"
          >
            <img src={src} alt={`new-${i}`} className="w-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemoveNewImage(i)}
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
    </section>
  );
}
