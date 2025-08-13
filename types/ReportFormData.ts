export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  subDistrict: string;
  district: string;
  province: string;
  postalCode: string;
}

interface AssistanceType {
  id: number;
}

interface ReportAssistance {
  assistanceType: AssistanceType;
  quantity: number;
  isActive: boolean;
}

export interface ReportFormData {
  userId: string;
  firstName: string;
  lastName: string;
  location: Location;
  mainPhoneNumber: string;
  reservePhoneNumber: string;
  additionalDetail: string;
  reportAssistances: ReportAssistance[];
}
