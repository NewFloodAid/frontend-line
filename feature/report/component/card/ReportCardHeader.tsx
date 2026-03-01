import Image from "next/image";
import { Report } from "@/types/Report";

interface Props {
  report: Report;
  date: string;
  time: string;
  status: string;
  onEdit: () => void;
  onDelete?: () => void;
}

export default function ReportCardHeader({
  report,
  date,
  time,
  status,
  onEdit,
  onDelete,
}: Props) {
  return (
    <>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <span>{date}</span>
          <span>เวลา {time} น.</span>
        </div>

        {status === "PENDING" && (
          <div className="flex gap-3">
            <button onClick={onEdit}>
              <Image
                src="/buttons/edit-button.svg"
                alt="edit"
                width={30}
                height={30}
              />
            </button>

            {onDelete && (
              <button onClick={onDelete}>
                <Image
                  src="/buttons/bin.png"
                  alt="delete"
                  width={25}
                  height={25}
                />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 mb-5">
        <span className="mr-2">ผู้แจ้ง</span>
        <span>
          {report.firstName} {report.lastName}
        </span>
      </div>
    </>
  );
}
