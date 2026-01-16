import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateActivityDto, UpdateActivityDto } from 'src/generated';
import { ActivityMapper } from './mappers/activity.mapper';

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Génère un temps d'attente simulé basé sur le thrill_level
   */
  private generateWaitTime(thrillLevel: number | null): number {
    const thrill = thrillLevel ?? 3;
    const minWait = 5 + (thrill - 1) * 5;
    const maxWait = Math.floor(25 + (thrill - 1) * 8.75);
    return Math.floor(Math.random() * (maxWait - minWait + 1)) + minWait;
  }

  async findAll(filters?: {
    search?: string;
    categoryId?: number;
    attractionId?: number;
  }) {
    const where: any = {};

    // Filtre par recherche (nom ou description)
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Filtre par catégorie
    if (filters?.categoryId) {
      where.category_id = filters.categoryId;
    }

    // Filtre par attraction
    if (filters?.attractionId) {
      where.attraction_id = filters.attractionId;
    }

    const activities = await this.prisma.activity.findMany({
      where,
      include: {
        category: true,
        attraction: true,
        relatedFrom: {
          include: {
            related_activity: {
              include: {
                category: true,
              },
            },
          },
        },
      } as any,
      orderBy: {
        created_at: 'desc',
      },
    });

    return activities.map((activity: any) => ({
      ...ActivityMapper.toDto(activity),
      wait_time: this.generateWaitTime(activity.thrill_level),
      category: {
        ...activity.category,
        created_at: activity.category.created_at.toISOString(),
        updated_at: activity.category.updated_at.toISOString(),
      },
      attraction: activity.attraction
        ? {
            ...activity.attraction,
            created_at: activity.attraction.created_at.toISOString(),
            updated_at: activity.attraction.updated_at.toISOString(),
          }
        : null,
      related_activities: activity.relatedFrom ? activity.relatedFrom.map((rel: any) => ({
        ...rel.related_activity,
        created_at: rel.related_activity.created_at.toISOString(),
        updated_at: rel.related_activity.updated_at.toISOString(),
        category: {
          ...rel.related_activity.category,
          created_at: rel.related_activity.category.created_at.toISOString(),
          updated_at: rel.related_activity.category.updated_at.toISOString(),
        },
      })) : [],
    }));
  }

  async findOne(id: number) {
    if (!id || id <= 0) {
      throw new BadRequestException('ID invalide');
    }

    const activity = await this.prisma.activity.findUnique({
      where: { id },
      include: {
        category: true,
        attraction: true,
        relatedFrom: {
          include: {
            related_activity: {
              include: {
                category: true,
              },
            },
          },
        },
      } as any,
    });

    if (!activity) {
      throw new NotFoundException(`Activité avec l'ID ${id} non trouvée`);
    }

    // Convertir les dates en ISO string avec mapper et ajouter wait_time simulé
    const activityWithRelations = activity as any;
    return {
      ...ActivityMapper.toDto(activity),
      wait_time: this.generateWaitTime(activityWithRelations.thrill_level),
      category: {
        ...activityWithRelations.category,
        created_at: activityWithRelations.category.created_at.toISOString(),
        updated_at: activityWithRelations.category.updated_at.toISOString(),
      },
      attraction: activityWithRelations.attraction
        ? {
            ...activityWithRelations.attraction,
            created_at: activityWithRelations.attraction.created_at.toISOString(),
            updated_at: activityWithRelations.attraction.updated_at.toISOString(),
          }
        : null,
      related_activities: (activityWithRelations.relatedFrom || []).map((rel: any) => ({
        ...rel.related_activity,
        created_at: rel.related_activity.created_at.toISOString(),
        updated_at: rel.related_activity.updated_at.toISOString(),
        category: {
          ...rel.related_activity.category,
          created_at: rel.related_activity.category.created_at.toISOString(),
          updated_at: rel.related_activity.category.updated_at.toISOString(),
        },
      })),
    };
  }

  async create(createActivityDto: CreateActivityDto & { related_activity_ids?: number[] }) {
    const { name, description, category_id, attraction_id, image_url, thrill_level, duration, min_age, accessibility, is_published, related_activity_ids } = createActivityDto;


    // Validation des champs requis
    if (!name || !description || !category_id) {
      throw new BadRequestException(
        'Le nom, la description et la catégorie sont requis',
      );
    }

    const categoryExists = await this.prisma.category.findUnique({
      where: { id: category_id },
    });

    if (!categoryExists) {
      throw new NotFoundException(
        `Catégorie avec l'ID ${category_id} non trouvée`,
      );
    }

    // Si attraction_id fourni, vérifier qu'elle existe
    if (attraction_id) {
      const attractionExists = await this.prisma.attraction.findUnique({
        where: { id: attraction_id },
      });

      if (!attractionExists) {
        throw new NotFoundException(
          `Attraction avec l'ID ${attraction_id} non trouvée`,
        );
      }
    }

    const activityData: any = {
      name,
      description,
      category_id,
      attraction_id: attraction_id ?? null,
      image_url: image_url ?? null,
      thrill_level: thrill_level ?? null,
      duration: duration ?? null,
      min_age: min_age ?? null,
      accessibility: accessibility ?? null,
      is_published: is_published !== undefined ? is_published : true,
    };

    if (related_activity_ids && related_activity_ids.length > 0) {
      activityData.relatedFrom = {
        create: related_activity_ids.map(relatedId => ({
          related_activity_id: relatedId,
        })),
      };
    }

    const activity = await this.prisma.activity.create({
      data: activityData,
      include: {
        category: true,
        attraction: true,
        relatedFrom: {
          include: {
            related_activity: {
              include: {
                category: true,
              },
            },
          },
        },
      } as any,
    });

    // Convertir les dates en ISO string avec mapper
    const createdActivity = activity as any;
    const result = {
      ...ActivityMapper.toDto(activity),
      category: {
        ...createdActivity.category,
        created_at: createdActivity.category.created_at.toISOString(),
        updated_at: createdActivity.category.updated_at.toISOString(),
      },
      attraction: createdActivity.attraction
        ? {
            ...createdActivity.attraction,
            created_at: createdActivity.attraction.created_at.toISOString(),
            updated_at: createdActivity.attraction.updated_at.toISOString(),
          }
        : null,
      related_activities: (createdActivity.relatedFrom || []).map((rel: any) => ({
        ...rel.related_activity,
        created_at: rel.related_activity.created_at.toISOString(),
        updated_at: rel.related_activity.updated_at.toISOString(),
        category: {
          ...rel.related_activity.category,
          created_at: rel.related_activity.category.created_at.toISOString(),
          updated_at: rel.related_activity.category.updated_at.toISOString(),
        },
      })),
    };

    return result;
  }

  async update(id: number, updateActivityDto: UpdateActivityDto & { related_activity_ids?: number[] }) {
    if (!id || id <= 0) {
      throw new BadRequestException('ID invalide');
    }

    const activityExists = await this.prisma.activity.findUnique({
      where: { id },
    });

    if (!activityExists) {
      throw new NotFoundException(`Activité avec l'ID ${id} non trouvée`);
    }

    const { name, description, category_id, attraction_id, image_url, thrill_level, duration, min_age, accessibility, is_published, related_activity_ids } = updateActivityDto;

    // Si category_id fourni, vérifier qu'elle existe
    if (category_id) {
      const categoryExists = await this.prisma.category.findUnique({
        where: { id: category_id },
      });

      if (!categoryExists) {
        throw new NotFoundException(
          `Catégorie avec l'ID ${category_id} non trouvée`,
        );
      }
    }

    // Si attraction_id fourni, vérifier qu'elle existe
    if (attraction_id) {
      const attractionExists = await this.prisma.attraction.findUnique({
        where: { id: attraction_id },
      });

      if (!attractionExists) {
        throw new NotFoundException(
          `Attraction avec l'ID ${attraction_id} non trouvée`,
        );
      }
    }

    // Préparer les données à mettre à jour
    const dataToUpdate: any = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (description !== undefined) dataToUpdate.description = description;
    if (category_id !== undefined) dataToUpdate.category_id = category_id;
    if (attraction_id !== undefined) dataToUpdate.attraction_id = attraction_id;
    if (image_url !== undefined) dataToUpdate.image_url = image_url;
    if (thrill_level !== undefined) dataToUpdate.thrill_level = thrill_level;
    if (duration !== undefined) dataToUpdate.duration = duration;
    if (min_age !== undefined) dataToUpdate.min_age = min_age;
    if (accessibility !== undefined) dataToUpdate.accessibility = accessibility;
    if (is_published !== undefined) dataToUpdate.is_published = is_published;

    // Gérer les activités liées
    if (related_activity_ids !== undefined) {
      // Supprimer les anciennes relations
      await (this.prisma as any).activityRelation.deleteMany({
        where: { activity_id: id },
      });

      // Créer les nouvelles relations
      if (related_activity_ids.length > 0) {
        dataToUpdate.relatedFrom = {
          create: related_activity_ids.map(relatedId => ({
            related_activity_id: relatedId,
          })),
        };
      }
    }

    const updatedActivity = await this.prisma.activity.update({
      where: { id },
      data: dataToUpdate,
      include: {
        category: true,
        attraction: true,
        relatedFrom: {
          include: {
            related_activity: {
              include: {
                category: true,
              },
            },
          },
        },
      } as any,
    });

    // Convertir les dates en ISO string avec mapper
    const updatedActivityData = updatedActivity as any;
    const result = {
      ...ActivityMapper.toDto(updatedActivity),
      category: {
        ...updatedActivityData.category,
        created_at: updatedActivityData.category.created_at.toISOString(),
        updated_at: updatedActivityData.category.updated_at.toISOString(),
      },
      attraction: updatedActivityData.attraction
        ? {
            ...updatedActivityData.attraction,
            created_at: updatedActivityData.attraction.created_at.toISOString(),
            updated_at: updatedActivityData.attraction.updated_at.toISOString(),
          }
        : null,
      related_activities: (updatedActivityData.relatedFrom || []).map((rel: any) => ({
        ...rel.related_activity,
        created_at: rel.related_activity.created_at.toISOString(),
        updated_at: rel.related_activity.updated_at.toISOString(),
        category: {
          ...rel.related_activity.category,
          created_at: rel.related_activity.category.created_at.toISOString(),
          updated_at: rel.related_activity.category.updated_at.toISOString(),
        },
      })),
    };

    return result;
  }

  async remove(id: number) {
    if (!id || id <= 0) {
      throw new BadRequestException('ID invalide');
    }

    const activityExists = await this.prisma.activity.findUnique({
      where: { id },
    });

    if (!activityExists) {
      throw new NotFoundException(`Activité avec l'ID ${id} non trouvée`);
    }

    await this.prisma.activity.delete({
      where: { id },
    });

    return { message: `Activité avec l'ID ${id} supprimée avec succès` };
  }
}
