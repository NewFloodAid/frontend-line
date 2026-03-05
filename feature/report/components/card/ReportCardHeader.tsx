import Image from "next/image";

interface Props {
  firstName: string;
  lastName: string;

  reportedAt: string;
  receivedAt?: string;
  resolvedAt?: string;

  status: "PENDING" | "PROCESS" | "SENT" | "SUCCESS";

  onEdit: () => void;
  onDelete?: () => void;
}

export default function ReportCardHeader({
  firstName,
  lastName,
  reportedAt,
  receivedAt,
  resolvedAt,
  status,
  onEdit,
  onDelete,
}: Props) {
  return (
    <>
      <div className="flex justify-between">
        <div className="mb-3 text-sm">
          <div>
            <span className="mr-2">แจ้งเหตุเมื่อ</span> {reportedAt}
          </div>

          {receivedAt && (
            <div>
              <span className="mr-2">รับเรื่องเมื่อ</span> {receivedAt}
            </div>
          )}

          {resolvedAt && (
            <div>
              <span className="mr-2">แก้ไขเมื่อ</span> {resolvedAt}
            </div>
          )}

          <div className="mt-3">
            <span className="mr-2">ผู้แจ้ง</span> {firstName} {lastName}
          </div>
        </div>

        {status === "PENDING" && (
          <div className="flex gap-3 items-start">
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
    </>
  );
}
