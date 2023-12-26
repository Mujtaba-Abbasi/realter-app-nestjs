import { PropertyType } from '@prisma/client';

export interface AddHomeParams {
  address: string;
  numberOfBathrooms: number;
  numberOfBedrooms: number;
  city: string;
  price: number;
  landSize: number;
  images: { url: string }[];
  propertyType: PropertyType;
}

export interface GetHomesFilterParams {
  propertyType?: PropertyType;
  price: {
    lte: number;
    gte: number;
  };
  city: string;
}
