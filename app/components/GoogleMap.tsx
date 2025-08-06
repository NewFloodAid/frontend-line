"use client";

import React, { useState, useRef, useEffect } from "react";
import { useUser } from "@/app/providers/userContext";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { getReport } from "@/app/api/reports";
import { GetReportBody } from "../types";
import { StatusEnum } from "@/app/status";
import Image from "next/image";

export default function MapComponent() {
  const user = useUser();
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
  const [locations, setLocations] = useState<GetReportBody[]>([]);

  useEffect(() => {
    if (user?.uid) {
      getUserLocation(10000);
      fetchLocations();
    }
  }, [user?.uid]);

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

  const fetchLocations = async () => {
    try {
      if (user?.uid) {
        const data = await getReport(user.uid);
        setLocations(data);
      }
    } catch (error) {
      console.error("Failed to fetch locations:", error);
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
        window.location.href = `/form?lat=${lat}&lng=${lng}`;
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
          {locations.map((location) => {
            // กำหนดสีของหมุดตามสถานะ
            let pinColor;
            switch (location.reportStatus.status) {
              case StatusEnum.PENDING:
                pinColor = "red";
                break;
              case StatusEnum.PROCESS:
                pinColor = "yellow";
                break;
              case StatusEnum.SUCCESS:
                pinColor = "green";
                break;
              case StatusEnum.SENT:
                pinColor = "blue";
                break;
              default:
                pinColor = "gray"; // กรณีที่สถานะไม่ตรงเงื่อนไข
            }

            return (
              <Marker
                key={location.id}
                position={{
                  lat: location.location.latitude,
                  lng: location.location.longitude,
                }}
                icon={{
                  url: `/${pinColor}-pin.png`, // รูปภาพหมุด (เช่น yellow-pin.png)
                  scaledSize: new window.google.maps.Size(37, 53),
                }}
                // onClick={() => {
                //   window.location.href = `/form?id=${location.id}`;
                // }}
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
            src="/pin-button.png" // รูปภาพปุ่ม
            alt="Button"
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
          <Image src="/gps-logo.png" alt="Pin" width={60} height={60} />
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
          <Image src="/blue-pin.png" alt="Pin" width={37} height={53} />
        </div>
      )}
    </div>
  );
}
