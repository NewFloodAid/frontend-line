import { StatusEnum } from "@/app/status";
import { GetReportBody, ImagePhaseEnum } from "@/app/types";

interface Props {
  report: GetReportBody;
}

const SuccessComponent: React.FC<Props> = ({ report }) => {
  const afterImages =
    report.images?.filter((img) => img.phase === ImagePhaseEnum.AFTER) ?? [];

  return (
    <>
      {report.reportStatus.status === StatusEnum.SUCCESS && (
        <>
          <div className="pt-4 space-y-4">
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
              <div className="flex flex-wrap gap-3">
                {afterImages.map((image, idx) => (
                  <div
                    key={idx}
                    className="w-24 h-24 bg-gray-200 rounded md:w-32 md:h-32 overflow-hidden"
                  >
                    <img
                      src={image.url}
                      alt={`Report Image ${idx + 1}`}
                      className="object-cover w-full h-full"
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
