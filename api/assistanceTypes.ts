import api from "@/libs/axios";
import { AssistanceTypes } from "@/types/AssistanceTypes";

async function getAssistanceTypes() {
  const res = await api.get<AssistanceTypes[]>("/assistanceTypes");
  return res.data;
}

export { getAssistanceTypes };
