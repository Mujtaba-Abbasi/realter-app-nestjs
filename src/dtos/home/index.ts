import { PropertyType } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateHomeDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsPositive()
  numberOfBathrooms: number;

  @IsNumber()
  @IsPositive()
  numberOfBedrooms: number;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  landSize: number;

  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Image)
  images: Image[];

  //   @IsNumber()
  //   @IsPositive()
  //   realterId: number;
}

class Image {
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class HomeResponseDto {
  id: number;
  address: string;
  city: string;
  price: number;

  @Exclude()
  number_of_bathrooms: number;
  @Exclude()
  number_of_bedrooms: number;
  @Exclude()
  listed_date: Date;
  @Exclude()
  property_type: PropertyType;
  @Exclude()
  created_at: Date;
  @Exclude()
  updated_at: Date;
  @Exclude()
  realter_id: number;
  @Exclude()
  land_size: number;

  @Expose({ name: 'numberOfBathrooms' })
  numberOfBathrooms() {
    return this.number_of_bathrooms;
  }

  @Expose({ name: 'numberOfBedrooms' })
  numberOfBedrooms() {
    return this.number_of_bedrooms;
  }

  @Expose({ name: 'listedDate' })
  listedDate() {
    return this.listed_date;
  }

  @Expose({ name: 'propertyType' })
  propertyType() {
    return this.property_type;
  }

  constructor(partial: Partial<HomeResponseDto>) {
    Object.assign(this, partial);
  }
}
