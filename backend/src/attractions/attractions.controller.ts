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
  Headers,
} from '@nestjs/common';
import { AttractionsService } from './attractions.service';
import type { CreateAttractionDto, UpdateAttractionDto } from 'src/generated';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { getLanguageFromRequest } from '../common/translations.util';

@Controller('attractions')
export class AttractionsController {
  constructor(private readonly attractionsService: AttractionsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('lang') lang?: string,
    @Headers('accept-language') acceptLanguage?: string,
  ) {
    const filters: any = {};
    const language = getLanguageFromRequest(acceptLanguage, lang);

    if (search) {
      filters.search = search;
    }

    if (categoryId) {
      filters.categoryId = parseInt(categoryId, 10);
    }

    return this.attractionsService.findAll(filters, language);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('lang') lang?: string,
    @Headers('accept-language') acceptLanguage?: string,
  ) {
    const language = getLanguageFromRequest(acceptLanguage, lang);
    return this.attractionsService.findOne(id, language);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAttractionDto: CreateAttractionDto) {
    return this.attractionsService.create(createAttractionDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAttractionDto: UpdateAttractionDto,
  ) {
    return this.attractionsService.update(id, updateAttractionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.attractionsService.remove(id);
  }
}
