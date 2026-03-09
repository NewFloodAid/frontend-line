"use client";

import ToggleSwitch from "@/components/ToggleSwitch";
import { StatusMappingENGToColor } from "@/constants/report_status";
import { loadLeaflet } from "@/libs/loadLeaflet";
import { createLeafletPinIcon, createPinSvgDataUrl } from "@/libs/pinIcon";
import { Report } from "@/types/Report";
import { getReports } from "@/api/reports";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

type LatLng = {
  lat: number;
  lng: number;
};

const defaultMapCenter: LatLng = {
  lat: 18.796143,
  lng: 98.979263,
};

const defaultMapZoom = 18;

const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletRef = useRef<any>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const initPromiseRef = useRef<Promise<void> | null>(null);

  const router = useRouter();
  const uid =
    typeof window !== "undefined" ? localStorage.getItem("uid") : null;

  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [center, setCenter] = useState<LatLng>(defaultMapCenter);
  const [reports, setReports] = useState<Report[]>([]);
  const [showAllPin, setShowAllPin] = useState(false);

  const filteredReports = showAllPin
    ? reports
    : reports.filter((report) => report.userId === uid);

  const clearMarkers = () => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
  };

  const resetLeafletContainer = (container: HTMLDivElement) => {
    const leafletContainer = container as HTMLDivElement & {
      _leaflet_id?: number;
    };

    if (leafletContainer._leaflet_id !== undefined) {
      container.innerHTML = "";
      leafletContainer._leaflet_id = undefined;
    }
  };

  const initializeMap = async () => {
    if (!mapContainerRef.current || mapRef.current) return;
    if (initPromiseRef.current) {
      await initPromiseRef.current;
      return;
    }

    initPromiseRef.current = (async () => {
      const L = await loadLeaflet();
      leafletRef.current = L;

      if (!mapContainerRef.current || mapRef.current) return;

      resetLeafletContainer(mapContainerRef.current);

      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      map.setView([defaultMapCenter.lat, defaultMapCenter.lng], defaultMapZoom);

      map.on("moveend", () => {
        const nextCenter = map.getCenter();
        setCenter((prev) => {
          if (
            Math.abs(prev.lat - nextCenter.lat) < 0.000001 &&
            Math.abs(prev.lng - nextCenter.lng) < 0.000001
          ) {
            return prev;
          }
          return { lat: nextCenter.lat, lng: nextCenter.lng };
        });
      });

      mapRef.current = map;
      setMapReady(true);
    })().finally(() => {
      initPromiseRef.current = null;
    });

    await initPromiseRef.current;
  };

  const getUserCoordinates = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nextCenter = { lat: latitude, lng: longitude };
        setCenter(nextCenter);
        if (mapRef.current) {
          mapRef.current.setView(
            [nextCenter.lat, nextCenter.lng],
            mapRef.current.getZoom(),
            { animate: true },
          );
        }
        setLoading(false);
      },
      (error) => {
        console.error("Fail to get coordinates:", error);
        setLoading(false);
      },
      { timeout: 10000 },
    );
  };

  const fetchData = () => {
    startTransition(async () => {
      if (!uid) {
        router.replace("/");
        return;
      }
      const res = await getReports();
      setReports(res);
    });
  };

  useEffect(() => {
    let active = true;

    const run = async () => {
      try {
        await initializeMap();
      } catch (error) {
        console.error("Failed to initialize OpenStreetMap:", error);
      }
      if (active) {
        fetchData();
        getUserCoordinates();
      }
    };

    run();

    return () => {
      active = false;
      initPromiseRef.current = null;
      clearMarkers();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      setMapReady(false);
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !mapRef.current || !leafletRef.current) return;

    clearMarkers();

    filteredReports.forEach((report) => {
      const pinColor =
        StatusMappingENGToColor[report.reportStatus.status] ?? "#ef4444";

      const marker = leafletRef.current
        .marker([report.location.latitude, report.location.longitude], {
          icon: createLeafletPinIcon(leafletRef.current, pinColor),
        })
        .addTo(mapRef.current);

      marker.on("click", () => {
        router.push(`/form?id=${report.id}`);
      });

      markersRef.current.push(marker);
    });
  }, [filteredReports, mapReady, router]);

  const handleButtonClick = () => {
    router.push(`/form?lat=${center.lat}&lng=${center.lng}`);
  };

  return (
    <div
      className={`relative w-full h-[calc(100vh-80px)] ${
        isPending || loading ? "w-full pointer-events-none opacity-50" : ""
      }`}
    >
      <div ref={mapContainerRef} className="h-full w-full" />

      <div
        className="absolute top-5 left-5 z-20 cursor-pointer"
        onClick={getUserCoordinates}
      >
        <Image
          src="/buttons/target-button.png"
          alt="target-button"
          width={60}
          height={60}
        />
      </div>

      <div
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
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

      {!loading && !isPending && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full z-10 pointer-events-none">
          <img
            src={createPinSvgDataUrl("#8b5cf6")}
            alt="Center pin"
            width={28}
            height={38}
          />
        </div>
      )}

      {(loading || isPending || !mapReady) && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40">
          <div className="text-white text-xl font-semibold">Loading...</div>
        </div>
      )}

      <div className="absolute top-0 right-0 m-3 p-3 z-20 bg-white rounded-md">
        <ToggleSwitch
          label="แสดงหมุดทั้งหมด"
          checked={showAllPin}
          onChange={setShowAllPin}
        />
      </div>
    </div>
  );
};

export default Map;
