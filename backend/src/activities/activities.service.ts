import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateActivityDto, UpdateActivityDto } from 'src/generated';

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

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
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Convertir les dates en ISO string
    return activities.map((activity) => ({
      ...activity,
      created_at: activity.created_at.toISOString(),
      updated_at: activity.updated_at.toISOString(),
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
      },
    });

    if (!activity) {
      throw new NotFoundException(`Activité avec l'ID ${id} non trouvée`);
    }

    // Convertir les dates en ISO string
    return {
      ...activity,
      created_at: activity.created_at.toISOString(),
      updated_at: activity.updated_at.toISOString(),
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
    };
  }

  async create(createActivityDto: CreateActivityDto) {
    const { name, description, category_id, attraction_id, image_url, thrill_level, duration, min_age, accessibility, is_published } = createActivityDto;

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

    const activity = await this.prisma.activity.create({
      data: {
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
      },
      include: {
        category: true,
        attraction: true,
      },
    });

    // Convertir les dates en ISO string
    return {
      ...activity,
      created_at: activity.created_at.toISOString(),
      updated_at: activity.updated_at.toISOString(),
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
    };
  }

  async update(id: number, updateActivityDto: UpdateActivityDto) {
    if (!id || id <= 0) {
      throw new BadRequestException('ID invalide');
    }

    const activityExists = await this.prisma.activity.findUnique({
      where: { id },
    });

    if (!activityExists) {
      throw new NotFoundException(`Activité avec l'ID ${id} non trouvée`);
    }

    const { name, description, category_id, attraction_id, image_url, thrill_level, duration, min_age, accessibility, is_published } = updateActivityDto;

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

    const updatedActivity = await this.prisma.activity.update({
      where: { id },
      data: dataToUpdate,
      include: {
        category: true,
        attraction: true,
      },
    });

    // Convertir les dates en ISO string
    return {
      ...updatedActivity,
      created_at: updatedActivity.created_at.toISOString(),
      updated_at: updatedActivity.updated_at.toISOString(),
      category: {
        ...updatedActivity.category,
        created_at: updatedActivity.category.created_at.toISOString(),
        updated_at: updatedActivity.category.updated_at.toISOString(),
      },
      attraction: updatedActivity.attraction
        ? {
            ...updatedActivity.attraction,
            created_at: updatedActivity.attraction.created_at.toISOString(),
            updated_at: updatedActivity.attraction.updated_at.toISOString(),
          }
        : null,
    };
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
