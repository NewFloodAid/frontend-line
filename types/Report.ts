interface Location {
  id: number;
  latitude: number;
  longitude: number;
  address: string;
  subDistrict: string;
  district: string;
  province: string;
  postalCode: string;
}

interface ReportStatus {
  id: number;
  status: "SENT" | "PENDING" | "PROCESS" | "SUCCESS";
  userOrderingNumber: number;
  governmentOrderingNumber: number;
}

interface AssistanceType {
  id: number;
  name: string;
  unit: string;
}

interface ReportAssistance {
  id: number;
  assistanceType: AssistanceType;
  quantity: number;
  isActive: boolean;
  reportId: number;
}

interface ImageCategory {
  id: number;
  name: string;
  fileLimit: number;
}

export interface ReportImage {
  id: number;
  name: string;
  phase: "BEFORE" | "AFTER";
  imageCategory: ImageCategory;
  url: string;
  reportId: number;
}

export interface Report {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  location: Location;
  mainPhoneNumber: string;
  reservePhoneNumber: string;
  reportStatus: ReportStatus;
  additionalDetail: string;
  afterAdditionalDetail: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  reportAssistances: ReportAssistance[];
  images: ReportImage[];
}

export interface GetReportsQueryParams {
  subDistrict?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  reportStatusId?: number;
  startDate?: string;
  endDate?: string;
  isUser?: boolean;
  userId?: string;
}
