import axios from "axios";

const axiosClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
  timeout: 30000,
});

axiosClient.interceptors.request.use(
  (request) => {
    const jwtToken = localStorage.getItem("jwtToken");

    if (request.url?.includes("/reports")) {
      request.headers.Authorization = `Bearer ${jwtToken}`;
      request.headers.set("X-Source-App", "LIFF");
    }

    // console.log(request);
    return request;
  },

  (error) => {
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosClient;
