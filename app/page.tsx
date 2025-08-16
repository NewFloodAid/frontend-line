"use client";
import { getJwt } from "@/api/auth";
import liff from "@line/liff";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();

  function formatUid(uid: string) {
    return uid
      .replace(/^U/, "")
      .replace(
        /^([a-f0-9]{8})([a-f0-9]{4})([a-f0-9]{4})([a-f0-9]{4})([a-f0-9]{12})$/,
        "$1-$2-$3-$4-$5"
      );
  }

  async function initializeLiff() {
    try {
      if (!process.env.NEXT_PUBLIC_LIFF_ID) {
        throw new Error("No liff id");
      }
      await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID });
      if (!liff.isLoggedIn()) {
        liff.login();
      } else {
        const idToken = liff.getIDToken();
        const userProfile = await liff.getProfile();
        if (idToken) {
          try {
            await getJwt(idToken);
            localStorage.setItem("uid", formatUid(userProfile.userId));
            router.replace("/request-location");
          } catch (e) {
            if ((e as Error).message === "InvalidLINEIDToken") {
              liff.logout();
              liff.login();
            } else if (
              (e as Error).message.includes("invalid authorization code")
            ) {
              console.info(
                "Expired auth code, LIFF will re-login automatically."
              );
            } else {
              throw e;
            }
          }
        }
      }
    } catch (err) {
      console.error("LIFF initialization failed: " + (err as Error).message);
    }
  }

  useEffect(() => {
    initializeLiff();
  }, []);

  return (
    <>
      <div>Loading...</div>
    </>
  );
}

export default Page;
