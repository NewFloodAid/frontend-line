import axiosClient from "@/libs/axios";

async function getJwt(idToken: string) {
  try {
    const res = await axiosClient.request({
      url: "/auth/line-login",
      method: "post",
      headers: { IDToken: idToken },
    });
    localStorage.setItem("jwtToken", res.data.jwtToken);
    return res.data;
  } catch (err: any) {
    if (
      err.response?.data?.status === "error" &&
      err.response?.data?.message === "Invalid LINE IDToken."
    ) {
      throw new Error("InvalidLINEIDToken");
    }
    throw err;
  }
}

export { getJwt };
