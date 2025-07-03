export type personalDetails = {
  firstName: string;
  lastName: string;
  phone: string;
  alternatePhone: string;
};

export type need = {
  id: number;
  name: string;
  unit: string;
  quantity: number;
};

export type location = {
  lat: string | null;
  lng: string | null;
};

export type image = {
  id: number;
  url: string;
};
