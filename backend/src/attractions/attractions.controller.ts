import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AttractionsService } from './attractions.service';
import type { CreateAttractionDto, UpdateAttractionDto } from 'src/generated';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('attractions')
export class AttractionsController {
  constructor(private readonly attractionsService: AttractionsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    const filters: any = {};

    if (search) {
      filters.search = search;
    }

    if (categoryId) {
      filters.categoryId = parseInt(categoryId, 10);
    }

    return this.attractionsService.findAll(filters);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.attractionsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAttractionDto: CreateAttractionDto) {
    return this.attractionsService.create(createAttractionDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAttractionDto: UpdateAttractionDto,
  ) {
    return this.attractionsService.update(id, updateAttractionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.attractionsService.remove(id);
  }
}