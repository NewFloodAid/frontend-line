"use client";

import { Report } from "@/types/Report";
import React from "react";

interface Props {
  report: Report;
}

const ReportCardMapComponent: React.FC<Props> = ({ report }) => {
  const lat = report.location.latitude;
  const lng = report.location.longitude;
  const delta = 0.0018;
  const bbox = `${lng - delta}%2C${lat - delta}%2C${lng + delta}%2C${lat + delta}`;
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <iframe
      title={`report-map-${report.id}`}
      src={embedUrl}
      className="h-full w-full border-0"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
};

export default ReportCardMapComponent;
