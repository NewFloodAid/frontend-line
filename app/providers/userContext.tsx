"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axios from "axios";
import liff from "@line/liff";
import { jwtDecode } from "jwt-decode";

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/line-login`;
const liffId = process.env.NEXT_PUBLIC_LIFF_ID || "";

interface DecodedToken {
  exp: number;
}

interface User {
  uid: string;
  idToken?: string;
  jwtToken?: string;
}

const UserContext = createContext<User | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const formatUid = (uid: string): string => {
    return uid
      .replace(/^U/, "")
      .replace(
        /^([a-f0-9]{8})([a-f0-9]{4})([a-f0-9]{4})([a-f0-9]{4})([a-f0-9]{12})$/,
        "$1-$2-$3-$4-$5"
      );
  };

  const loginWithIdToken = async (idToken: string) => {
    try {
      // console.log("Sending ID Token to backend:", idToken);
      const response = await axios.post(
        API_URL,
        {},
        {
          headers: { IDToken: idToken },
        }
      );

      // console.log("Backend Response:", response.data);

      if (response.data.jwtToken) {
        localStorage.setItem("jwtToken", response.data.jwtToken);
        return response.data.jwtToken;
      }
      return null;
    } catch (error) {
      console.error(
        "Login failed:",
        axios.isAxiosError(error)
          ? error.response?.data || error.message
          : error
      );
      return null;
    }
  };

  const isTokenExpired = (token: string) => {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime; // ตรวจสอบว่า Token หมดอายุหรือไม่
    } catch (error) {
      console.error("Failed to decode token:", error);
      return true;
    }
  };

  const initializeLiff = async () => {
    try {
      await liff.init({ liffId });

      if (!liff.isLoggedIn()) {
        liff.login();
      } else {
        const idToken = liff.getIDToken();
        if (!idToken || isTokenExpired(idToken)) {
          // console.log("ID Token expired");
          liff.logout();
          liff.login();
          return;
        }

        const profile = await liff.getProfile();
        if (profile && idToken) {
          const formattedUid = formatUid(profile.userId);
          const jwtToken = await loginWithIdToken(idToken);

          setUser({ uid: formattedUid, idToken, jwtToken });
        }
      }
    } catch (error) {
      console.error("LIFF initialization failed:", error);
    }
  };

  useEffect(() => {
    initializeLiff();
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  return useContext(UserContext);
};
