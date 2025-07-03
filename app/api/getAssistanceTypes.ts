import { need } from "@/app/form/type";
const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/assistanceTypes`;

export const getAssistanceTypes = async () => {
  try {
    const response = await fetch(API_URL);
    const data: { id: number; name: string; unit: string }[] =
      await response.json();

    // ปรับข้อมูล response ให้อยู่ในรูปแบบที่ต้องการ และเรียงลำดับตาม id
    const needsData: need[] = data
      .map((item) => ({
        id: item.id,
        name: item.name,
        unit: item.unit,
        quantity: 0, // ตั้งค่าเริ่มต้น quantity เป็น 0
      }))
      .sort((a, b) => a.id - b.id); // เรียงลำดับตาม id จากน้อยไปมาก

    // console.log(needsData);
    return needsData;
  } catch (error) {
    console.error("Error fetching needs:", error);
  }
};
