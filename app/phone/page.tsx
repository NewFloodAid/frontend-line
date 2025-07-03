"use client";
import { useEffect, useState } from "react";
import { getPhoneNumber } from "../api/phone";

export default function PhonePage() {
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      try {
        const fetchedPhoneNumber = await getPhoneNumber();
        if (fetchedPhoneNumber) {
          setPhoneNumber(fetchedPhoneNumber);
        }
      } catch (error) {
        console.error("Error fetching phone number:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhoneNumber();
  }, []);

  const handleCallClick = () => {
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      {loading ? (
        <p className="text-lg text-gray-600 font-semibold">
          กำลังโหลดข้อมูลเบอร์โทรศัพท์...
        </p>
      ) : phoneNumber ? (
        <button
          onClick={handleCallClick}
          className="mt-4 w-100 py-3 px-4 rounded-lg text-base transition bg-blue-500 text-white hover:bg-blue-600"
        >
          โทรไปยังเบอร์ {phoneNumber}
        </button>
      ) : (
        <p className="text-lg text-red-600 font-semibold">
          ไม่สามารถดึงหมายเลขโทรศัพท์ได้
        </p>
      )}
    </div>
  );
}
