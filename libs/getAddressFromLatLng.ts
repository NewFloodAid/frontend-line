import axios from "axios";
import { Location } from "@/types/ReportFormData";

const getAddressFromLatLng = async (
  lat: string | null,
  lng: string | null,
): Promise<Location> => {
  if (!lat || !lng) {
    throw new Error("Latitude and Longitude are required");
  }

  const latitude = Number(lat);
  const longitude = Number(lng);

  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
    lat,
  )}&lon=${encodeURIComponent(lng)}&addressdetails=1&accept-language=th`;

  try {
    const response = await axios.get(url, {
      headers: {
        "Accept-Language": "th",
      },
    });

    const result = response.data;
    if (!result?.address) {
      throw new Error("No address found for the given coordinates.");
    }

    const address = result.display_name ?? "";
    const addressObject = result.address as Record<string, string | undefined>;

    const subDistrict =
      addressObject.suburb ??
      addressObject.city_district ??
      addressObject.neighbourhood ??
      addressObject.quarter ??
      addressObject.village ??
      addressObject.hamlet ??
      "";

    const district =
      addressObject.county ??
      addressObject.district ??
      addressObject.city ??
      addressObject.town ??
      addressObject.municipality ??
      "";

    const province = addressObject.state ?? addressObject.region ?? "";
    const postalCode = addressObject.postcode ?? "";

    return {
      latitude,
      longitude,
      address,
      subDistrict,
      district,
      province,
      postalCode,
    };
  } catch (error) {
    console.error("Error fetching address:", error);
    throw error;
  }
};

export default getAddressFromLatLng;
