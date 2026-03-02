interface Props {
  status: "SENT" | "PENDING" | "PROCESS" | "SUCCESS";
}

/**
 * สร้าง status text ที่สวยงาม
 * @param status
 * @returns status in Thai with beautiful color
 */
export default function StatusBadge({ status }: Props) {
  const StatusMappingENGToTextColor: Record<string, string> = {
    PENDING: "text-red-500",
    PROCESS: "text-orange-500",
    SENT: "text-blue-500",
    SUCCESS: "text-green-500",
  };

  const StatusMappingToTH: { [key: string]: string } = {
    PENDING: "ยังไม่ได้รับเรื่อง",
    PROCESS: "รวบรวมข้อมูล",
    SENT: "ส่งเรื่องไปแล้ว",
    SUCCESS: "เสร็จสิ้น",
  };

  return (
    <label className={`${StatusMappingENGToTextColor[status]}`}>
      {StatusMappingToTH[status]}
    </label>
  );
}
