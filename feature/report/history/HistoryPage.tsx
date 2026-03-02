"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HistoryContent from "./HistoryContent";

/**
 * HistoryPage
 *
 * หน้าที่ของ Component นี้:
 * 1. ตรวจสอบสถานะการยืนยันตัวตนจาก localStorage (uid)
 * 2. หากไม่พบ uid ให้ทำการ redirect ออกจากหน้านี้
 * 3. แสดงหน้า HistoryContent เฉพาะเมื่อยืนยันตัวตนสำเร็จแล้ว
 *
 * ความหมายของค่า uid:
 * - undefined  = ยังอยู่ระหว่างตรวจสอบสถานะ
 * - null       = ตรวจสอบแล้ว แต่ไม่พบ uid (ยังไม่เข้าสู่ระบบ)
 * - string     = พบ uid และสามารถใช้งานต่อได้
 */
export default function HistoryPage() {
  const router = useRouter();

  // ใช้ state เพื่อเก็บสถานะ uid และควบคุมลำดับการ render
  const [uid, setUid] = useState<string | null | undefined>(undefined);

  /**
   * ดึงค่า uid จาก localStorage
   */
  useEffect(() => {
    const storedUid = localStorage.getItem("uid");
    setUid(storedUid);
  }, []);

  /**
   * กรณียังไม่ทราบสถานะ uid
   * แสดงหน้า Loading ชั่วคราวเพื่อป้องกันการเรียก hook ก่อนเวลาอันควร
   */
  if (uid === undefined) {
    return (
      <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40">
        <div className="text-white text-xl font-semibold">กำลังโหลด...</div>
      </div>
    );
  }

  /**
   * หากไม่พบ uid หลังตรวจสอบแล้ว
   * ให้ redirect ผู้ใช้งานกลับหน้าแรก
   */
  if (uid === null) {
    router.replace("/");
    return null;
  }

  /**
   * กรณีพบ uid และยืนยันตัวตนสำเร็จ
   * ส่งค่า uid ไปยัง HistoryContent เพื่อดึงข้อมูลรายงานของผู้ใช้
   */
  return <HistoryContent uid={uid} />;
}
