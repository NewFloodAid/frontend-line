import Link from "next/link";
import React from "react";

interface MenuProps {
  isOpen: boolean;
  closeMenu: () => void;
}

const Menu: React.FC<MenuProps> = ({ isOpen, closeMenu }) => {
  if (!isOpen) return null; // ไม่แสดงเมนูถ้า isOpen เป็น false

  return (
    <div
      className="fixed top-[4rem] left-0 w-full h-full flex flex-col items-center z-20"
      style={{
        backgroundColor: "#505050", // ตั้งค่าสีพื้นหลัง
        marginTop: "15px", // กำหนดระยะห่างจาก navbar
      }}
    >
      <div className="w-full p-8 rounded-t-lg">
        <ul className="space-y-8 text-center text-white">
          <li>
            <Link
              href="/request-location"
              className="text-white-500 text-base hover:underline"
              onClick={closeMenu}
            >
              ปักหมุดแจ้งเหตุ
            </Link>
          </li>
          <li>
            <Link
              href="/history"
              className="text-white-500 text-base hover:underline"
              onClick={closeMenu}
            >
              สิ่งที่ฉันแจ้ง
            </Link>
          </li>
          <li>
            <Link
              href="/community"
              className="text-white-500 text-base hover:underline"
              onClick={closeMenu}
            >
              สอดส่องชุมชน
            </Link>
          </li>
          <li>
            <Link
              href="/instruction"
              className="text-white-500 text-base hover:underline"
              onClick={closeMenu}
            >
              วิธีใช้งาน
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Menu;
