interface Props {
  status: string;
  isExpanded: boolean;
  toggleExpand?: () => void;
  statusText: string;
}

const STATUS_COLOR: Record<string, string> = {
  PENDING: "text-red-500",
  PROCESS: "text-orange-500",
  SENT: "text-blue-500",
  SUCCESS: "text-green-500",
};

export default function ReportCardFooter({
  status,
  isExpanded,
  toggleExpand,
  statusText,
}: Props) {
  return (
    <div className="flex items-center mt-5 pt-2 border-t">
      {status === "SENT" && toggleExpand && (
        <button
          onClick={toggleExpand}
          className={`px-4 py-3 rounded-lg text-white transition
            ${
              isExpanded
                ? "bg-red-400 hover:bg-red-500"
                : "bg-green-500 hover:bg-green-600"
            }`}
        >
          {isExpanded ? "ยกเลิก" : "อัพเดต"}
        </button>
      )}

      {status === "SUCCESS" && toggleExpand && (
        <button
          onClick={toggleExpand}
          className="text-gray-700 underline font-semibold"
        >
          {isExpanded ? "ซ่อนรายละเอียด" : "แสดงรายละเอียด"}
        </button>
      )}

      <span className={`ml-auto font-semibold ${STATUS_COLOR[status]}`}>
        {statusText}
      </span>
    </div>
  );
}
