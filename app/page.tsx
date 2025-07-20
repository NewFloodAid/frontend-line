"use client";

import { useUser } from "./providers/userContext";
import GoogleMap from "./components/GoogleMap";

function Page() {
  const user = useUser();
  if (!user) {
    return <div>Loading...</div>;
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
