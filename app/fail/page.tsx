"use client";
import Image from "next/image";
import Link from "next/link";

const Fail = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-50">
      <div className="relative w-36 h-36">
        <Image
          src="/icons/fail.png" // รูปภาพในโฟลเดอร์ public
          alt="Fail"
          layout="fill"
          objectFit="contain"
        />
      </div>
      <p className="mt-4 text-2xl font-bold text-red-500">เกิดข้อผิดพลาด</p>
      <label className="text-lg text-red-500">โปรดลองอีกครั้งในภายหลัง</label>
      <Link href={"/request-location"}>
        <button className="mt-4 px-6 py-2 border-2 border-blue-400 font-bold text-blue-400 rounded-lg hover:bg-blue-400 hover:text-white transition-all">
          กลับไปหน้าเลือกตำแหน่ง
        </button>
      </Link>
      <Link href={"/history"}>
        <button className="mt-4 px-6 py-2 border-2 border-red-400 font-bold text-red-400 rounded-lg hover:bg-red-400 hover:text-white transition-all">
          ดูประวัติการแจ้งเหตุของฉัน
        </button>
      </Link>
    </div>
  );
};

export default Fail;
