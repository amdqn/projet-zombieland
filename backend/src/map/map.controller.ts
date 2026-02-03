import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  Headers,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { MapService } from './map.service';
import { getLanguageFromRequest } from '../common/translations.util';

@ApiTags('map')
@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get('points')
  @ApiOperation({
    summary:
      'Récupère tous les points de la carte (attractions, activités, POI)',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste de tous les points avec coordonnées GPS',
  })
  async getAllMapPoints(
    @Query('lang') lang?: string,
    @Headers('accept-language') acceptLanguage?: string,
  ) {
    const language = getLanguageFromRequest(acceptLanguage, lang);
    return this.mapService.getAllMapPoints(language);
  }

  @Get('bounds')
  @ApiOperation({ summary: 'Récupère les bornes géographiques du parc' })
  @ApiResponse({
    status: 200,
    description: 'Bornes min/max de latitude et longitude',
  })
  async getMapBounds() {
    return this.mapService.getMapBounds();
  }

  @Get('point/:id')
  @ApiOperation({ summary: 'Récupère un point spécifique par ID et type' })
  @ApiParam({ name: 'id', description: 'ID du point', type: Number })
  @ApiQuery({
    name: 'type',
    description: 'Type du point (attraction, activity, poi)',
    enum: ['attraction', 'activity', 'poi'],
  })
  @ApiResponse({
    status: 200,
    description: 'Détails du point',
  })
  async getMapPointById(
    @Param('id', ParseIntPipe) id: number,
    @Query('type') type: 'attraction' | 'activity' | 'poi',
  ) {
    return this.mapService.getMapPointById(id, type);
  }
}
