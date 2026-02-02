import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  transformTranslatableFields,
  transformTranslatableArray,
  type Language,
} from '../common/translations.util';

@Injectable()
export class MapService {
  constructor(private prisma: PrismaService) {}

  /**
   * Génère un temps d'attente simulé basé sur le thrill_level
   */
  private generateWaitTime(thrillLevel: number | null): number {
    const thrill = thrillLevel ?? 3;
    const minWait = 5 + (thrill - 1) * 5;
    const maxWait = Math.floor(25 + (thrill - 1) * 8.75);
    return Math.floor(Math.random() * (maxWait - minWait + 1)) + minWait;
  }

  /**
   * Récupère tous les points de la carte (attractions, activités, POI)
   */
  async getAllMapPoints(lang: Language = 'fr') {
    const [attractions, activities, pois] = await Promise.all([
      // Attractions avec leurs catégories
      this.prisma.attraction.findMany({
        where: {
          AND: [
            { latitude: { not: null } },
            { longitude: { not: null } },
          ],
        },
        include: {
          category: true,
        },
        orderBy: {
          name: 'asc',
        },
      }),
      // Activités avec leurs catégories
      this.prisma.activity.findMany({
        where: {
          AND: [
            { latitude: { not: null } },
            { longitude: { not: null } },
          ],
        },
        include: {
          category: true,
        },
        orderBy: {
          name: 'asc',
        },
      }),
      // Points d'intérêt (toilettes, boutiques, etc.)
      this.prisma.pointOfInterest.findMany({
        orderBy: {
          name: 'asc',
        },
      }),
    ]);

    // Ajouter wait_time simulé aux attractions et activités
    const attractionsWithWaitTime = attractions.map((attraction) => ({
      ...attraction,
      wait_time: this.generateWaitTime(attraction.thrill_level),
    }));

    const activitiesWithWaitTime = activities.map((activity) => ({
      ...activity,
      wait_time: this.generateWaitTime(activity.thrill_level),
    }));

    return {
      attractions: attractionsWithWaitTime.map((attraction) => ({
        ...transformTranslatableFields(attraction, lang),
        category: transformTranslatableFields(attraction.category, lang),
      })),
      activities: activitiesWithWaitTime.map((activity) => ({
        ...transformTranslatableFields(activity, lang),
        category: transformTranslatableFields(activity.category, lang),
      })),
      pois: transformTranslatableArray(pois, lang),
    };
  }

  /**
   * Récupère les bornes géographiques du parc
   */
  async getMapBounds() {
    const attractions = await this.prisma.attraction.findMany({
      where: {
        AND: [
          { latitude: { not: null } },
          { longitude: { not: null } },
        ],
      },
      select: {
        latitude: true,
        longitude: true,
      },
    });

    const activities = await this.prisma.activity.findMany({
      where: {
        AND: [
          { latitude: { not: null } },
          { longitude: { not: null } },
        ],
      },
      select: {
        latitude: true,
        longitude: true,
      },
    });

    const pois = await this.prisma.pointOfInterest.findMany({
      select: {
        latitude: true,
        longitude: true,
      },
    });

    const allPoints = [...attractions, ...activities, ...pois];

    if (allPoints.length === 0) {
      return null;
    }

    const latitudes = allPoints.map((p) => Number(p.latitude));
    const longitudes = allPoints.map((p) => Number(p.longitude));

    return {
      minLat: Math.min(...latitudes),
      maxLat: Math.max(...latitudes),
      minLng: Math.min(...longitudes),
      maxLng: Math.max(...longitudes),
    };
  }

  /**
   * Récupère un point spécifique par ID et type
   */
  async getMapPointById(id: number, type: 'attraction' | 'activity' | 'poi') {
    switch (type) {
      case 'attraction':
        return this.prisma.attraction.findUnique({
          where: { id },
          include: {
            category: true,
            images: true,
          },
        });
      case 'activity':
        return this.prisma.activity.findUnique({
          where: { id },
          include: {
            category: true,
            attraction: true,
          },
        });
      case 'poi':
        return this.prisma.pointOfInterest.findUnique({
          where: { id },
        });
      default:
        return null;
    }
  }
}
