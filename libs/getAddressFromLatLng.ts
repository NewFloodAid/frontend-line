import axios from "axios";
import { Location } from "@/types/ReportFormData";

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

const getAddressFromLatLng = async (
  lat: string | null,
  lng: string | null
): Promise<Location> => {
  if (!lat || !lng) {
    throw new Error("Latitude and Longitude are required");
  }

  const latitude = Number(lat);
  const longitude = Number(lng);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}&language=th`;

  try {
    const response = await axios.get(url);
    const result = response.data.results[0];

    if (result) {
      const address = result.formatted_address;
      const addressComponents: AddressComponent[] = result.address_components;

      const subDistrict =
        addressComponents
          .find(
            (component) =>
              component.types.includes("locality") ||
              component.types.includes("sublocality")
          )
          ?.long_name.replace(/^ตำบล\s*/, "") || "";
      const district =
        addressComponents
          .find((component) =>
            component.types.includes("administrative_area_level_2")
          )
          ?.long_name.replace(/^อำเภอ\s*/, "") || "";
      const province =
        addressComponents.find((component) =>
          component.types.includes("administrative_area_level_1")
        )?.long_name || "";
      const postalCode =
        addressComponents.find((component) =>
          component.types.includes("postal_code")
        )?.long_name || "";

      return {
        latitude,
        longitude,
        address,
        subDistrict,
        district,
        province,
        postalCode,
      };
    } else {
      throw new Error("No address found for the given coordinates.");
    }
  } catch (error) {
    console.error("Error fetching address:", error);
    throw error;
  }
};

export default getAddressFromLatLng;
