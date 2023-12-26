import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto, HomeResponseDto } from 'src/dtos';
import { PropertyType } from '@prisma/client';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: PropertyType,
  ): Promise<HomeResponseDto[]> {
    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
          }
        : undefined;

    const filters = {
      ...(city && { city }),
      ...(price && { price }),
      ...(propertyType && { propertyType }),
    };

    return this.homeService.getHomes(filters);
  }

  @Get('/:id')
  getHome(@Param('id') id: number): Promise<HomeResponseDto> {
    return this.homeService.getHome(id);
  }

  @Post()
  createHome(@Body() body: CreateHomeDto): Promise<HomeResponseDto> {
    return this.homeService.createHome(body);
  }

  @Put('/:id')
  updateHome(@Body() body: any, @Param('id') id: number) {
    console.log(`ID: ${id}`);
    console.log(`Body: ${JSON.stringify(body)}`);
    return this.homeService.updateHome();
  }

  @Delete('/:id')
  deleteHomeById(@Param('id') id: number) {
    return this.homeService.deleteHomeById(id);
  }
}
