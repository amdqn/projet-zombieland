import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards, Query,
  Headers,
} from '@nestjs/common';
import { PricesService } from './prices.service';
import type { CreatePriceDto, UpdatePriceDto } from 'src/generated';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { getLanguageFromRequest } from '../common/translations.util';

@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Get()
  findAll(
      @Query('priceType') priceType?: string,
      @Query('page') page?: string,
      @Query('limit') limit?: string,
      @Query('sortBy') sortBy?: string,
      @Query('amount') amount?: string,
      @Query('lang') lang?: string,
      @Headers('accept-language') acceptLanguage?: string,
  ) {
    const filters: any = {};
    const language = getLanguageFromRequest(acceptLanguage, lang);

    if (priceType) {
      filters.priceType = priceType;
    }

    if (page) {
      filters.page = parseInt(page, 10);
    }

    if (limit) {
      filters.limit = parseInt(limit, 10);
    }

    if (sortBy) {
      filters.sortBy = sortBy;
    }

    if (amount) {
      filters.amount = parseFloat(amount);
    }

    return this.pricesService.findAll(filters, language);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('lang') lang?: string,
    @Headers('accept-language') acceptLanguage?: string,
  ) {
    const language = getLanguageFromRequest(acceptLanguage, lang);
    return this.pricesService.findOne(id, language);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() createPriceDto: CreatePriceDto) {
    return this.pricesService.create(createPriceDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePriceDto: UpdatePriceDto,
  ) {
    return this.pricesService.update(id, updatePriceDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pricesService.remove(id);
  }
}
