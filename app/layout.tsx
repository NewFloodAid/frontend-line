import React from "react";
import { MapProvider } from "@/providers/map-provider";
import Navbar from "../components/navbar/navbar";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>
        <MapProvider>
          <Navbar />
          <main>{children}</main>
        </MapProvider>
      </body>
    </html>
  );
}
