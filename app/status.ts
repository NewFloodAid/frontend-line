export const statusMapping = (status: StatusEnum) => {
  const map: Record<string, { label: string; color: string }> = {
    PENDING: { label: "ยังไม่ได้รับเรื่อง", color: "text-red-500" },
    PROCESS: { label: "รวบรวมข้อมูล", color: "text-yellow-500" },
    SUCCESS: { label: "ได้รับการแก้ไขแล้ว", color: "text-green-500" },
    SENT: { label: "ส่งเรื่องไปแล้ว", color: "text-blue-500" },
  };

  return map[status] ?? { label: "ไม่พบสถานะ", color: "text-gray-500" };
};

export enum StatusEnum {
  SENT = "SENT",
  PENDING = "PENDING",
  PROCESS = "PROCESS",
  SUCCESS = "SUCCESS",
}

export interface ReportStatus {
  id: number;
  status: StatusEnum;
  userOrderingNumber: number;
  governmentOrderingNumber: number;
}
