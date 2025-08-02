export const statusMapping = (status: string) => {
  const map: Record<string, { label: string; color: string }> = {
    PENDING: { label: "รอดำเนินการ", color: "text-red-500" },
    PROCESS: { label: "รวบรวมข้อมูล", color: "text-yellow-500" },
    SUCCESS: { label: "สำเร็จ", color: "text-green-500" },
    SENT: { label: "ส่งเรื่องไปแล้ว", color: "text-blue-500" },
  };

  return map[status] ?? { label: "ไม่พบสถานะ", color: "text-gray-500" };
};
