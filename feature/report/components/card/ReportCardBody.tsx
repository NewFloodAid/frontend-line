import { Report } from "@/types/Report";
import ReportCardMapComponent from "../Map";

interface Props {
  report: Report;
  firstAssistance?: string;
  isExpanded: boolean;
}

export default function ReportCardBody({ report, firstAssistance }: Props) {
  const selectedAssistances = report.reportAssistances.filter((assistance) => assistance.quantity > 0);

  return (
    <>
      <div className="mb-4">
        <h3 className="mb-2 font-semibold">{firstAssistance}</h3>
        <div className="mb-2 space-y-1">
          {selectedAssistances.map((assistance) => {
            const extraDetail = assistance.extraDetail?.trim();
            const extraFieldLabel = assistance.assistanceType.extraFieldLabel?.trim();
            if (!extraDetail) {
              return null;
            }

            return (
              <p key={`assist-extra-${assistance.id}`} className="ml-3 text-sm text-gray-700">
                {(extraFieldLabel || "รายละเอียดเพิ่มเติม") + ": "}
                {extraDetail}
              </p>
            );
          })}
        </div>
        <p className="ml-3">{report.additionalDetail}</p>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        <div className="h-40 w-56 rounded-md overflow-hidden shadow-lg shrink-0">
          <ReportCardMapComponent report={report} />
        </div>

        {report.images
          .filter((image) => image.phase === "BEFORE")
          .map((image) => (
            <img
              key={image.id}
              src={image.url}
              alt="report"
              className="h-40 rounded-md shadow-lg"
            />
          ))}
      </div>
    </>
  );
}
