export const statusMapping = (status: string) => {
  const map: Record<string, { label: string; color: string }> = {
    PENDING: { label: "รอรับเรื่อง", color: "text-yellow-500" },
    PROCESS: { label: "กำลังดำเนินการ", color: "text-blue-500" },
    SUCCESS: { label: "สำเร็จ", color: "text-green-500" },
    REJECTED: { label: "ตรวจสอบเเล้วไม่พบเหตุ", color: "text-red-500" },
  };

  return map[status] ?? { label: "ไม่พบสถานะ", color: "text-gray-500" };
};
