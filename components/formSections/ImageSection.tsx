import { ReportImage } from "@/types/Report";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface ImageSectionProps {
  onImagesChange: (files: File[]) => void;
  deletedImageIds: number[];
  setDeletedImageIds: (numbers: number[]) => void;
  initialImages?: ReportImage[];
}

export default function ImageSection({
  onImagesChange,
  deletedImageIds,
  setDeletedImageIds,
  initialImages = [],
}: ImageSectionProps) {
  const MAX_IMAGES = 4;

  const [newImages, setNewImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  // render รูป
  useEffect(() => {
    const objectUrls = newImages.map((file) => URL.createObjectURL(file));
    setNewImagePreviews(objectUrls);

    return () => {
      objectUrls.forEach(URL.revokeObjectURL);
    };
  }, [newImages]);

  useEffect(() => {
    setImageUrls(initialImages.map((image) => image.url));
  }, [initialImages]);

  // อัพเดตรูปที่อัพ
  useEffect(() => {
    onImagesChange(newImages);
  }, [newImages, onImagesChange]);

  // function อัพรูป
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);

    setNewImages((prev) => {
      const totalExisting = imageUrls.length + prev.length;
      const availableSlots = MAX_IMAGES - totalExisting;

      if (availableSlots <= 0) {
        e.target.value = "";
        return prev;
      }

      const filesToAdd = filesArray.slice(0, availableSlots);

      return [...prev, ...filesToAdd];
    });

    e.target.value = "";
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
      <label className="my-2">แนบรูปถ่ายสถานการณ์ (สูงสุด 4 รูป)</label>
      <button
        type="button"
        onClick={openFileDialog}
        className="upload-image-button"
      >
        <Image src="/form/upload-icon.svg" alt="icon" width={30} height={30} />
      </button>
      <input
        ref={inputRef}
        multiple
        onChange={onFileChange}
        className="sr-only"
        type="file"
      />

      <div className="grid grid-cols-2 gap-3 mt-3">
        {/* แสดงรูปเก่า (URL) */}
        {imageUrls.map((url, i) => (
          <div
            key={"old-" + i}
            className="relative h-32 border rounded overflow-hidden"
          >
            <img
              src={url}
              alt={`old-${i}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemoveOldImage(i)}
              className="absolute top-0 right-0"
            >
              <Image
                src="/delete-button.png"
                alt="icon"
                width={20}
                height={20}
              />
            </button>
          </div>
        ))}

        {/* แสดงรูปใหม่ (File) */}
        {newImagePreviews.map((src, i) => (
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
              onClick={() => handleRemoveNewImage(i)}
              className="absolute top-0 right-0"
            >
              <Image
                src="/delete-button.png"
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
