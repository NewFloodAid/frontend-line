import { ReportStatus } from "./status";

export interface UserDetails {
  firstName: string;
  lastName: string;
  phone: string;
  alternatePhone: string;
}

export interface AssistanceItem {
  id: number;
  name: string;
  unit: string;
  quantity: number;
}

export interface AssistanceType {
  id: number;
  name: string;
  unit: string;
}

export interface Coordinates {
  lat: string | null;
  lng: string | null;
}

export interface ReportImage {
  id: number;
  url: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  subDistrict: string;
  district: string;
  province: string;
  postalCode: string;
}

export interface CreateReportBody {
  userId: string;
  firstName: string;
  lastName: string;
  location: Location;
  mainPhoneNumber: string;
  reservePhoneNumber: string;
  additionalDetail: string;
  reportAssistances: {
    assistanceType: { id: number };
    quantity: number;
    isActive: boolean;
  }[];
}

export type GetReportBody = {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  location: Location;
  mainPhoneNumber: string;
  reservePhoneNumber: string;
  priority: number;
  reportStatus: ReportStatus;
  additionalDetail: string;
  afterAdditionalDetail: string;
  createdAt: string;
  updatedAt: string;
  reportAssistances: {
    id: number;
    assistanceType: AssistanceType;
    quantity: number;
    isActive: boolean;
    reportId: number;
  }[];
  images: {
    id: number;
    name: string;
    phase: string;
    imageCategory: {
      id: number;
      name: string;
      fileLimit: number;
    };
    url: string;
    reportId: number;
  }[];
};
