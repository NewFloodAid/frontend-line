import getAddressFromLatLng from "@/app/lib/getAddressFromLatLng";
const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/reports`;

interface Report {
  userId: string;
  firstName: string;
  lastName: string;
  location: {
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
  additionalDetail: string;
  reportAssistances: {
    assistanceType: { id: number };
    quantity: number;
    isActive: boolean;
  }[];
}

export const createReport = async (
  userId: string,
  location: { lat: string | null; lng: string | null },
  personalDetails: {
    firstName: string;
    lastName: string;
    phone: string;
    alternatePhone: string;
  },
  needs: {
    id: number;
    name: string;
    unit: string;
    quantity: number;
  }[],
  details: string
): Promise<Report> => {
  try {
    const addressData = await getAddressFromLatLng(location.lat, location.lng);
    return {
      userId,
      firstName: personalDetails.firstName,
      lastName: personalDetails.lastName,
      location: {
        latitude: Number(location.lat),
        longitude: Number(location.lng),
        address: addressData.address,
        subDistrict: addressData.subDistrict,
        district: addressData.district,
        province: addressData.province,
        postalCode: addressData.postalCode,
      },
      mainPhoneNumber: personalDetails.phone,
      reservePhoneNumber: personalDetails.alternatePhone,
      additionalDetail: details,
      reportAssistances: needs.map((need) => ({
        assistanceType: { id: need.id },
        quantity: need.quantity,
        isActive: need.quantity > 0,
      })),
    };
  } catch (error) {
    console.error("Error creating help request:", error);
    throw error;
  }
};

export const sendReport = async (report: Report, photos: File[]) => {
  try {
    const formData = new FormData();
    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) {
      throw new Error("User is not authenticated.");
    }
    // เพิ่ม report ในรูปแบบ JSON string
    formData.append("report", JSON.stringify(report));

    // เพิ่ม photos ในรูปแบบไฟล์
    photos.forEach((file) => {
      formData.append("files", file);
    });

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "X-Source-App": "LIFF",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`status: ${response.status}`);
    }

    // const result = await response.json();
    // console.log("Response from backend:", result);
  } catch (error) {
    console.error("Error sending help request:", error);
    throw error;
  }
};
