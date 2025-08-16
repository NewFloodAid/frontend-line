"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Report } from "@/types/Report";
import { getReports } from "@/api/reports";
import Image from "next/image";

export default function MapComponent() {
  const router = useRouter();

  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  // Chiang Mai, Thailand
  const centre = {
    lat: 18.796143,
    lng: 98.979263,
  };

  const [userLocation, setUserLocation] =
    useState<google.maps.LatLngLiteral | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [reports, setReport] = useState<Report[]>([]);

  useEffect(() => {
    getUserLocation(10000);
    fetchData();
  }, []);

  const getUserLocation = (timeout: number) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude }); // อัพเดทตำแหน่งผู้ใช้
        },
        () => {
          setUserLocation(centre);
        },
        { timeout: timeout }
      );
    }
  };

  const fetchData = async () => {
    const uid = localStorage.getItem("uid");
    const jwtToken = localStorage.getItem("jwtToken");
    if (uid && jwtToken) {
      const data = await getReports(uid);
      setReport(data);
    } else {
      router.replace("/");
    }
  };

  const handleButtonGpsClick = () => {
    getUserLocation(Number.MAX_SAFE_INTEGER);
    if (mapRef.current && userLocation) {
      mapRef.current.panTo(userLocation); // เคลื่อนแผนที่ไปที่ตำแหน่งผู้ใช้
    }
  };

  const handleButtonClick = () => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter();
      if (center) {
        const lat = center.lat();
        const lng = center.lng();

        // ส่งผู้ใช้ไปยังหน้าฟอร์ม
        router.push(`/form?lat=${lat}&lng=${lng}`);
      }
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "calc(100vh - 80px)", // หักความสูง Navbar
      }}
    >
      {/* เช็คว่า userLocation ยังไม่มีค่า หรือ google ยังไม่โหลด */}
      {!userLocation ? (
        <div>Loading...</div>
      ) : (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={userLocation}
          zoom={18}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            clickableIcons: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => {
            mapRef.current = map;
          }}
        >
          {reports.map((report) => {
            // กำหนดสีของหมุดตามสถานะ
            let pinColor;
            switch (report.reportStatus.status) {
              case "PENDING":
                pinColor = "red";
                break;
              case "PROCESS":
                pinColor = "yellow";
                break;
              case "SUCCESS":
                pinColor = "green";
                break;
              case "SENT":
                pinColor = "blue";
                break;
            }

            return (
              <Marker
                key={report.id}
                position={{
                  lat: report.location.latitude,
                  lng: report.location.longitude,
                }}
                icon={{
                  url: `/pins/${pinColor}-pin.png`, // รูปภาพหมุด (เช่น yellow-pin.png)
                  scaledSize: new window.google.maps.Size(37, 53),
                }}
                onClick={() => {
                  router.push(`/form?id=${report.id}`);
                }}
              />
            );
          })}
        </GoogleMap>
      )}

      {/* ปุ่มปักหมุด */}
      {!userLocation ? null : (
        <div
          style={{
            position: "absolute",
            bottom: "20px", // ระยะห่างจากขอบล่าง
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            cursor: "pointer",
          }}
          onClick={handleButtonClick}
        >
          <Image
            src="/buttons/pin-button.png" // รูปภาพปุ่ม
            alt="pin-button"
            width={150}
            height={150}
            priority
          />
        </div>
      )}

      {/* ปุ่มอัพเดตตำแหน่ง */}
      {!userLocation ? null : (
        <div
          style={{
            position: "absolute",
            top: "20px", // ระยะห่างจากขอบบน
            left: "20px", // ระยะห่างจากขอบซ้าย
            zIndex: 10,
            cursor: "pointer",
          }}
          onClick={handleButtonGpsClick}
        >
          <Image
            src="/buttons/target-button.png"
            alt="target-button"
            width={60}
            height={60}
          />
        </div>
      )}

      {/* หมุดที่ลอยอยู่กลางจอ */}
      {!userLocation ? null : (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -100%)",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <Image src="/pins/red-pin.png" alt="Pin" width={37} height={53} />
        </div>
      )}
    </div>
  );
}
