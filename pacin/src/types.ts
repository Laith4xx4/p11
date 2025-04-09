export interface Property {
  id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  currency: string;
  image: string;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  area: number;
  university: string;
  amenities: string[];
  lat: number;
  lng: number;
  stats?: {
    available: number;
    students: number;
    satisfaction: number;
  };
}
