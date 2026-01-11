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
                  src="/buttons/back-button.png"
                  alt="Back Logo"
                  width={30}
                  height={30}
                />
              </button>
            ) : (
              <div className="w-[30px] h-[30px]" />
            )}
          </div>

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
