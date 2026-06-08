import axiosClient from "@/libs/axios";
import { AssistanceTypes } from "@/types/AssistanceTypes";

async function getAssistanceTypes(districtName?: string) {
  try {
    let url = "/assistanceTypes";
    if (districtName) {
      // First, get districts to find the matching ID
      const districtsRes = await axiosClient.get<any[]>("/districts");
      const districts = districtsRes.data;
      
      // Try to find the district
      // OSM sometimes prefixes with 'อำเภอ' or 'เขต'
      const cleanName = districtName.replace(/^(อำเภอ|เขต)/, "").trim();
      const match = districts.find(d => 
        d.nameInThai === cleanName || 
        d.nameInThai === districtName ||
        `อำเภอ${d.nameInThai}` === districtName
      );

      if (match && match.id) {
        url = `/assistanceTypes?districtId=${match.id}`;
      }
    }

    const res = await axiosClient.get<AssistanceTypes[]>(url);
    return res.data;
  } catch (err) {
    console.error("Fetch assistance types failed:", err);
    throw err;
  }
}

export { getAssistanceTypes };
