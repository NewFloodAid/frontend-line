import axios from "axios";
const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/reports`;

export type GetReportBody = {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  location: {
    id: number;
    latitude: number;
    longitude: number;
    address: string;
    subDistrict: string;
    district: string;
    province: string;
    postalCode: string;
  };
  mainPhoneNumber: string;
  reservePhoneNumber: string;
  priority: number;
  reportStatus: {
    id: number;
    status: string;
    userOrderingNumber: number;
    governmentOrderingNumber: number;
  };
  additionalDetail: string;
  createdAt: string;
  updatedAt: string;
  reportAssistances: {
    id: number;
    assistanceType: {
      id: number;
      name: string;
      priority: number;
      unit: string;
    };
    quantity: number;
    isActive: boolean;
    reportId: number;
  }[];
  images: {
    id: number;
    name: string;
    imageCategory: {
      id: number;
      name: string;
      fileLimit: number;
    };
    url: string;
    reportId: number;
  }[];
};

export const getReport = async (userId: string) => {
  try {
    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) {
      throw new Error("User is not authenticated.");
    }

    const response = await axios.get<GetReportBody[]>(
      `${API_URL}/filters?priorities=1,2,3,4&userId=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "X-Source-App": "LIFF",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};
