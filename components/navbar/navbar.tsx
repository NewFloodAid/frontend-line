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
  const [currentTitle, setCurrentTitle] = useState<string>("");

  // Mapping URL Pathname -> Title
  const pageTitles: Record<string, string> = {
    "/": "Loading...",
    "/request-location": "ปักหมุดขอความช่วยเหลือ",
    "/form": "กรอกข้อมูลขอความช่วยเหลือ",
    "/success": " ",
    "/history": "ประวัติการขอความช่วยเหลือ",
    "/phone": "ติดต่อกู้ภัย",
    "/instruction": "วิธีใช้งาน",
  };

  // Get current page title
  function getPageTitle(path: string) {
    return pageTitles[path] || "Page";
  }

  // Set currentTitle ให้ตรงกับหน้าแรกที่โหลด
  React.useEffect(() => {
    setCurrentTitle(getPageTitle(pathname));
  }, [pathname]);

  // ฟังก์ชันเปิด/ปิดเมนู
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);

    // เปลี่ยน currentTitle เป็น "เมนู" เมื่อเปิดเมนู
    if (!isMenuOpen) {
      setCurrentTitle("เมนู");
    } else {
      setCurrentTitle(getPageTitle(pathname)); // กลับค่าเดิมเมื่อปิดเมนู
    }
  };

  const back = () => {
    router.push("/");
  };

  return (
    <div>
      <nav className="navbar-fixed p-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Back button */}
          <button className="text-white text-lg">
            <Image
              onClick={back}
              src="/logo-back.png"
              alt="Back Logo"
              width={30}
              height={30}
            />
          </button>

          {/* title */}
          <div className="flex-grow text-center">
            <h1 className="text-white text-base font-medium">{currentTitle}</h1>
          </div>

          {/* menu button */}
          <button
            className="bg-transparent p-2 rounded-lg"
            onClick={toggleMenu}
          >
            <Image
              src="/logo-menu.png"
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
