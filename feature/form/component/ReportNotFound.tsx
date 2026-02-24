import { useRouter } from "next/navigation";

export default function RoportNotFound() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white p-8 shadow-md rounded-lg text-center">
        <h2 className="text-2xl font-bold text-red-500">
          ไม่พบข้อมูลการแจ้งเรื่อง
        </h2>
        <p className="text-gray-600 mt-3">
          ไม่พบข้อมูลการแจ้งเรื่องตามที่คุณร้องขอ
        </p>
        <button
          onClick={() => router.replace("/request-location")}
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          กลับไปหน้าเลือกตำแหน่ง
        </button>
      </div>
    </div>
  );
}
