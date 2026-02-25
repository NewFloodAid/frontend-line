import { Report } from "@/types/Report";
import ReportCardMapComponent from "../Map";

interface Props {
  report: Report;
  firstAssistance?: string;
  isExpanded: boolean;
}

export default function ReportCardBody({ report, firstAssistance }: Props) {
  return (
    <>
      <div className="mb-4">
        <h3 className="mb-2 font-semibold">{firstAssistance}</h3>
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
