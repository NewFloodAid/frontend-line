import React from "react";
import GoogleMapsProvider from "../providers/GoogleMapsProvider";
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
        <GoogleMapsProvider>
          <Navbar />
          <main>{children}</main>
        </GoogleMapsProvider>
      </body>
    </html>
  );
}
