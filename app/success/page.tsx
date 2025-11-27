"use client";
import Image from "next/image";
import Link from "next/link";

const Success = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-50">
      <div className="relative w-36 h-36">
        <Image
          src="/icons/check.png" // รูปภาพในโฟลเดอร์ public
          alt="Success"
          layout="fill"
          objectFit="contain"
        />
      </div>
      <p className="mt-4 text-2xl font-bold text-green-500">
        ขอความช่วยเหลือสำเร็จ
      </p>
      <Link href={"/request-location"}>
        <button className="mt-4 px-6 py-2 border-2 border-blue-400 font-bold text-blue-400 rounded-lg hover:bg-blue-400 hover:text-white transition-all">
          ขอความช่วยเหลือถัดไป
        </button>
      </Link>
    </div>
  );
};

export default Success;
