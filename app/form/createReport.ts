import getAddressFromLatLng from "@/app/lib/getAddressFromLatLng";
import * as Types from "@/app/types";

export const createReport = async (
  userId: string,
  Coordinates: { lat: string | null; lng: string | null },
  userDetails: Types.UserDetails,
  assistances: Types.AssistanceItem[],
  additionalDetail: string
): Promise<Types.CreateReportBody> => {
  try {
    const addressData = await getAddressFromLatLng(
      Coordinates.lat,
      Coordinates.lng
    );
    return {
      userId,
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      location: {
        latitude: Number(Coordinates.lat),
        longitude: Number(Coordinates.lng),
        address: addressData.address,
        subDistrict: addressData.subDistrict,
        district: addressData.district,
        province: addressData.province,
        postalCode: addressData.postalCode,
      },
      mainPhoneNumber: userDetails.phone,
      reservePhoneNumber: userDetails.alternatePhone,
      additionalDetail: additionalDetail,
      reportAssistances: assistances.map((assistance) => ({
        assistanceType: { id: assistance.id },
        quantity: assistance.quantity,
        isActive: assistance.quantity > 0,
      })),
    };
  } catch (error) {
    console.error("Error creating help request:", error);
    throw error;
  }
};

export const createUpdateReport = async (
  report: Types.GetReportBody,
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
): Promise<Types.GetReportBody> => {
  const updatedReport = {
    ...report,
    firstName: personalDetails.firstName,
    lastName: personalDetails.lastName,
    mainPhoneNumber: personalDetails.phone,
    reservePhoneNumber: personalDetails.alternatePhone,
    additionalDetail: details,
    reportAssistances: needs.map((need) => {
      const existingAssistance = report.reportAssistances.find(
        (assistance) => assistance.assistanceType.id === need.id
      );

      return {
        id: existingAssistance?.id ?? 0, // ถ้าไม่มีค่า id ให้ใช้ 0
        assistanceType: existingAssistance?.assistanceType ?? {
          id: need.id,
          name: "",
          priority: 0,
          unit: "",
        },
        quantity: need.quantity,
        isActive: need.quantity > 0 ? true : false,
        reportId: report.id,
      };
    }),
  };

  return updatedReport;
};
