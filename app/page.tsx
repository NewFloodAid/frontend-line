"use client";

import { useUser } from "./providers/userContext";
import Loading from "./components/Loading";
import GoogleMap from "./components/GoogleMap";

function Page() {
  const user = useUser();
  if (!user) {
    return <Loading />;
  }

  return (
    <>
      <div>
        <GoogleMap />
      </div>
    </>
  );
}

export default Page;
