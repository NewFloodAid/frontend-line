import axiosClient from "@/libs/axios";
import { AssistanceTypes } from "@/types/AssistanceTypes";

async function getAssistanceTypes() {
  try {
    const res = await axiosClient.get<AssistanceTypes[]>("/assistanceTypes");
    return res.data;
  } catch (err) {
    console.error("Fetch reports failed:", err);
    throw err;
  }
}

export { getAssistanceTypes };
