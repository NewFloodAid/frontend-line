"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Menu from "./menu";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Mapping URL Pathname -> Title
  const pageTitles: Record<string, string> = {
    "/": "Loading...",
    "/request-location": "ปักหมุด ณ จุดที่เกิดปัญหา",
    "/form": "กรอกข้อมูลการแจ้งเหตุ",
    "/success": " ",
    "/history": "สิ่งที่ฉันแจ้ง",
    "/phone": "ติดต่อกู้ภัย",
    "/community": "สอดส่องชุมชน",
    "/instruction": "วิธีใช้งาน",
  };

  // Get current page title
  function getPageTitle(path: string) {
    return pageTitles[path] || "Page";
  }

  // ฟังก์ชันเปิด/ปิดเมนู
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const back = () => {
    router.push("/request-location");
  };

  return (
    <div>
      <nav className="navbar-fixed p-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Back button */}
          <div className="w-[30px] h-[30px]">
            {pathname !== "/request-location" ? (
              <button className="text-white text-lg" onClick={back}>
                <Image
                  src="/buttons/pin.png"
                  alt="Pin"
                  width={30}
                  height={30}
                />
              </button>
            ) : (
              <div className="w-[30px] h-[30px]" />
            )}
          </div>

          {/* title */}
          <h1 className="text-white text-base font-medium">
            {isMenuOpen ? "เมนู" : getPageTitle(pathname)}
          </h1>

          {/* menu button */}
          <button
            className="bg-transparent p-2 rounded-lg"
            onClick={toggleMenu}
          >
            <Image
              src="/buttons/menu-button.png"
              alt="Menu Logo"
              width={30}
              height={30}
            />
          </button>
        </div>
      </nav>

      {/* Menu */}
      <Menu isOpen={isMenuOpen} closeMenu={() => setIsMenuOpen(false)} />
    </div>
  );
};

export default Navbar;
