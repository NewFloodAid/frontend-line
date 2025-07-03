import React from "react";
import Image from "next/image";
import { image } from "@/app/form/type";

type FileUploadProps = {
  files: (File | image)[];
  setFiles: React.Dispatch<React.SetStateAction<(File | image)[]>>;
  id: number[];
  setId: React.Dispatch<React.SetStateAction<number[]>>;
  reportStatus: string;
};

const Detail: React.FC<FileUploadProps> = ({
  files,
  setFiles,
  setId,
  reportStatus,
}) => {
  const isEditable = reportStatus === "PENDING" || reportStatus === "";
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditable) return;
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
  };

  const handleRemoveFile = async (index: number) => {
    if (!isEditable) return;
    const fileToRemove = files[index];
    if ("id" in fileToRemove) {
      setId((prevIds) => [...prevIds, fileToRemove.id]);
    }
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-10">
      <label className="mb-2 block font-medium text-gray-700 text-base">
        แนบรูปถ่ายสถานการณ์ (สูงสุด 4 รูป)
      </label>
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
              {(file as image).url ? (
                <img
                  src={(file as image).url}
                  alt={`Preview ${index + 1}`}
                  className="h-full w-full object-cover"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                />
              ) : (
                <img
                  src={URL.createObjectURL(file as File)}
                  alt={`Preview ${index + 1}`}
                  className="h-full w-full object-cover"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                />
              )}
              {isEditable && (
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
              )}
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
          disabled={!isEditable || files.length === 4}
          id="dropzone-file"
          type="file"
          className="hidden"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};

export default Detail;
