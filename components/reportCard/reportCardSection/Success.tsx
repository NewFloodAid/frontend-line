"use client";
import { Report } from "@/types/Report";

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
                  <img
                    key={idx}
                    src={image.url}
                    alt={`Report Image ${idx + 1}`}
                    className="h-32 rounded-md shadow-lg"
                  />
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
