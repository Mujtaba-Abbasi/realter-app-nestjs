import { Injectable, NotFoundException } from '@nestjs/common';
import { HomeResponseDto } from 'src/dtos';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddHomeParams, GetHomesFilterParams } from 'src/types';

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHomes(filters: GetHomesFilterParams): Promise<HomeResponseDto[]> {
    const homes = await this.prismaService.home.findMany({
      select: {
        id: true,
        address: true,
        number_of_bathrooms: true,
        number_of_bedrooms: true,
        city: true,
        price: true,
        land_size: true,
        property_type: true,
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
      where: {
        ...filters,
      },
    });
    return homes.map((item) => new HomeResponseDto(item));
  }

  async getHome(id: number): Promise<HomeResponseDto> {
    const home = await this.prismaService.home.findFirst({
      where: {
        id,
      },
    });

    if (!home) {
      console.log('Home not found!');
      throw new NotFoundException();
    }

    return new HomeResponseDto(home);
  }

  async createHome(params: AddHomeParams): Promise<HomeResponseDto> {
    const {
      address,
      numberOfBathrooms,
      numberOfBedrooms,
      city,
      price,
      landSize,
      propertyType,
      images,
    } = params;

    const home = await this.prismaService.home.create({
      data: {
        address: address,
        number_of_bathrooms: numberOfBathrooms,
        number_of_bedrooms: numberOfBedrooms,
        city: city,
        price: price,
        property_type: propertyType,
        land_size: landSize,
        realter_id: 5,
      },
    });

    const imagesData = images.map((image) => {
      return {
        url: image.url,
        home_id: home.id,
      };
    });

    await this.prismaService.image.createMany({ data: imagesData });

    return new HomeResponseDto(home);
  }

  async updateHome() {}

  async deleteHomeById(id: number) {
    try {
      await this.prismaService.image.deleteMany({ where: { home_id: id } });
      await this.prismaService.home.delete({ where: { id } });
    } catch (error) {
      throw new NotFoundException(`Home with ID ${id} not found`);
    }
  }
}
