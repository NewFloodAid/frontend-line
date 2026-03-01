/*Since the map was loaded on client side, 
we need to make this component client rendered as well*/
"use client";

//Map component Component from library
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useEffect, useState, useTransition, useRef } from "react";
import { Report } from "@/types/Report";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getReports } from "@/api/reports";
import { StatusMappingENGToPinColor } from "@/constants/report_status";
import ToggleSwitch from "@/components/ToggleSwitch";

//Map's styling
const defaultMapContainerStyle = {
  width: "100%",
  height: "100%",
};

//Chiang Mai's coordinates
const defaultMapCenter = {
  lat: 18.796143,
  lng: 98.979263,
};

//Default zoom level, can be adjusted
const defaultMapZoom = 18;

//Map options
const defaultMapOptions = {
  zoomControl: true,
  tilt: 0,
  gestureHandling: "auto",
  streetViewControl: false,
  mapTypeControl: false,
  clickableIcons: false,
  cameraControl: false,
  fullscreenControl: false,
};

const Map = () => {
  const mapRef = useRef<google.maps.Map>(null);
  const router = useRouter();
  const uid =
    typeof window !== "undefined" ? localStorage.getItem("uid") : null;

  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState(defaultMapCenter);
  const [reports, setReports] = useState<Report[]>([]);
  const [showAllMarker, setShowAllMarker] = useState(false);

  const filteredReports = showAllMarker
    ? reports
    : reports.filter((report) => report.userId === uid);

  function handleLoad(map: google.maps.Map) {
    mapRef.current = map;
  }

  function handleCenterChanged() {
    if (!mapRef.current) return;
    const newPos = mapRef.current.getCenter()?.toJSON();
    if (!newPos) return;
    setCenter(newPos);
  }

  function getUserCoordinates() {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude }); // อัพเดทตำแหน่งผู้ใช้
          setLoading(false);
        },
        (error) => {
          console.error("Fail to get coordinates: ", error);
          setLoading(false);
        },
        { timeout: 10000 },
      );
    }
  }

  function fetchData() {
    startTransition(async () => {
      if (!uid) {
        router.replace("/");
      } else {
        const res = await getReports();
        setReports(res);
      }
    });
  }

  useEffect(() => {
    fetchData();
    getUserCoordinates();
  }, []);

  function handleButtonClick() {
    router.push(`/form?lat=${center.lat}&lng=${center.lng}`);
  }

  return (
    <div
      className={`relative w-full h-[calc(100vh-80px)] ${
        isPending || loading ? "w-full pointer-events-none opacity-50" : ""
      }`}
    >
      <GoogleMap
        mapContainerStyle={defaultMapContainerStyle}
        center={center}
        zoom={defaultMapZoom}
        options={defaultMapOptions}
        onLoad={handleLoad}
        onDragEnd={handleCenterChanged}
      >
        {/* render หมุดตาม reports ที่มี */}
        {filteredReports.map((report) => {
          const MarkerColor =
            StatusMappingENGToPinColor[report.reportStatus.status];

          return (
            <Marker
              key={report.id}
              position={{
                lat: report.location.latitude,
                lng: report.location.longitude,
              }}
              icon={{
                url: `/markers/marker-${MarkerColor}.png`,
                scaledSize: new window.google.maps.Size(50, 50),
              }}
              onClick={() => {
                router.push(`/form?id=${report.id}`);
              }}
            />
          );
        })}
      </GoogleMap>

      {/* getUserCoordinates button */}
      <div
        className="absolute top-5 left-5 z-10 cursor-pointer"
        onClick={getUserCoordinates}
      >
        <Image
          src="/buttons/target-button.png"
          alt="target-button"
          width={60}
          height={60}
        />
      </div>

      {/* ปุ่มปักหมุด */}
      <div
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 cursor-pointer"
        onClick={handleButtonClick}
      >
        <Image
          src="/buttons/new-pin-button.png"
          alt="pin-button"
          width={150}
          height={150}
          priority
        />
      </div>

      {/* หมุดกลางจอ */}
      {!loading && !isPending && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-10 pointer-events-none">
          <Image
            src="/markers/marker-pink.png"
            alt="Marker"
            width={50}
            height={50}
          />
        </div>
      )}

      {(loading || isPending) && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40">
          <div className="text-white text-xl font-semibold">กำลังโหลด...</div>
        </div>
      )}

      {/* toggle switch โชว์หมุดคนอื่น */}
      <div className="absolute top-0 right-0 m-3 p-3 z-10 bg-white rounded-md">
        <ToggleSwitch
          label="แสดงหมุดของคนอื่น"
          checked={showAllMarker}
          onChange={setShowAllMarker}
        />
      </div>
    </div>
  );
};

export default Map;
