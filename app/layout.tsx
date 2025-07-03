import React from "react";
import { UserProvider } from "./providers/userContext";
import GoogleMapsProvider from "./providers/GoogleMapsProvider";
import Navbar from "./components/navbar";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>
        <UserProvider>
          <GoogleMapsProvider>
            <Navbar />
            <main>{children}</main>
          </GoogleMapsProvider>
        </UserProvider>
      </body>
    </html>
  );
}
