"use client";
import { Report } from "@/types/Report";
import Image from "next/image";

interface Props {
  report: Report;
}

const SuccessComponent: React.FC<Props> = ({ report }) => {
  const afterImages =
    report.images?.filter((img) => img.phase === "AFTER") ?? [];

  return (
    <>
      {report.reportStatus.status === "SUCCESS" && (
        <>
          <div className="pt-4 mb-10">
            {report.afterAdditionalDetail && (
              <div>
                <p className="font-medium mb-1">อัปเดตหลังการแก้ไข</p>
                <p className="text-gray-600">{report.afterAdditionalDetail}</p>
              </div>
            )}
          </div>
          <div>
            <p className="font-medium mb-2">รูปหลังการแก้ไข</p>
            {afterImages.length > 0 && (
              <div className="flex flex-row gap-2 justify-start mb-3 overflow-x-auto flex-nowrap scroll-smooth">
                {afterImages.map((image, idx) => (
                  <div key={idx} className="relative h-32 w-32 rounded-md shadow-lg overflow-hidden shrink-0">
                    <Image
                      src={image.url}
                      alt={`Report Image ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 33vw, 25vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default SuccessComponent;
