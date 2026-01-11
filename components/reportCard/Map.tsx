"use client";
import { Report } from "@/types/Report";
import { GoogleMap, Marker } from "@react-google-maps/api";
import React from "react";

interface Props {
  report: Report;
}

const defaultMapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultMapZoom = 16;

const defaultMapOptions = {
  disableDefaultUI: true,
  draggable: false,
  scrollwheel: false,
  disableDoubleClickZoom: true,
  keyboardShortcuts: false,
  clickableIcons: false,
  gestureHandling: "none",
  styles: [
    {
      featureType: "poi",
      elementType: "all",
      stylers: [{ visibility: "off" }],
    },
  ],
};

const ReportCardMapComponent: React.FC<Props> = ({ report }) => {
  const center = {
    lat: report.location.latitude,
    lng: report.location.longitude,
  };

  return (
    <div className="h-40 w-56 rounded-md overflow-hidden shadow-lg shrink-0">
      <GoogleMap
        mapContainerStyle={defaultMapContainerStyle}
        center={center}
        zoom={defaultMapZoom}
        options={defaultMapOptions}
      >
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
};

export default ReportCardMapComponent;
