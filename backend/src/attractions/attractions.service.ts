import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateAttractionDto, UpdateAttractionDto } from 'src/generated';
import {
  transformTranslatableFields,
  transformTranslatableArray,
  type Language,
} from '../common/translations.util';

@Injectable()
export class AttractionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    filters?: { search?: string; categoryId?: number },
    lang: Language = 'fr',
  ) {
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

    const attractions = await this.prisma.attraction.findMany({
      where,
      include: {
        category: true,
        images: true,
        activities: true,
        relatedFrom: {
          include: {
            related_attraction: {
              include: {
                category: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Convertir les dates en ISO string et appliquer les traductions
    return attractions.map((attraction) => {
      const transformedAttraction = transformTranslatableFields(attraction, lang);
      return {
        ...transformedAttraction,
        created_at: attraction.created_at.toISOString(),
        updated_at: attraction.updated_at.toISOString(),
        category: transformTranslatableFields(attraction.category, lang),
        images: attraction.images.map((image) => ({
          ...transformTranslatableFields(image, lang),
          created_at: image.created_at.toISOString(),
        })),
        activities: attraction.activities.map((activity) => ({
          ...transformTranslatableFields(activity, lang),
          created_at: activity.created_at.toISOString(),
          updated_at: activity.updated_at.toISOString(),
        })),
        related_attractions: attraction.relatedFrom
          ? transformTranslatableArray(
              attraction.relatedFrom.map((rel: any) => rel.related_attraction),
              lang,
            )
          : [],
      };
    });
  }

  async findOne(id: number, lang: Language = 'fr') {
    if (!id || id <= 0) {
      throw new BadRequestException('ID invalide');
    }

    const attraction = await this.prisma.attraction.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        activities: true,
        relatedFrom: {
          include: {
            related_attraction: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!attraction) {
      throw new NotFoundException(`Attraction avec l'ID ${id} non trouvée`);
    }

    // Convertir les dates en ISO string et appliquer les traductions
    const transformedAttraction = transformTranslatableFields(attraction, lang);
    return {
      ...transformedAttraction,
      created_at: attraction.created_at.toISOString(),
      updated_at: attraction.updated_at.toISOString(),
      category: transformTranslatableFields(attraction.category, lang),
      images: attraction.images.map((image) => ({
        ...transformTranslatableFields(image, lang),
        created_at: image.created_at.toISOString(),
      })),
      activities: attraction.activities.map((activity) => ({
        ...transformTranslatableFields(activity, lang),
        created_at: activity.created_at.toISOString(),
        updated_at: activity.updated_at.toISOString(),
      })),
      related_attractions: transformTranslatableArray(
        (attraction.relatedFrom || []).map((rel: any) => rel.related_attraction),
        lang,
      ),
    };
  }

  async create(createAttractionDto: CreateAttractionDto & { is_published?: boolean; related_attraction_ids?: number[] }) {
    const { name, description, category_id, image_url, thrill_level, duration, is_published, related_attraction_ids } = createAttractionDto;

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

    const attractionData: any = {
      name,
      description,
      category_id,
      image_url: image_url || null,
      thrill_level: thrill_level || null,
      duration: duration || null,
      is_published: is_published !== undefined ? is_published : true,
    };

    if (related_attraction_ids && related_attraction_ids.length > 0) {
      attractionData.relatedFrom = {
        create: related_attraction_ids.map(relatedId => ({
          related_attraction_id: relatedId,
        })),
      };
    }

    const attraction = await this.prisma.attraction.create({
      data: attractionData,
      include: {
        category: true,
        images: true,
        activities: true,
        relatedFrom: {
          include: {
            related_attraction: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    // Convertir les dates en ISO string
    return {
      ...attraction,
      created_at: attraction.created_at.toISOString(),
      updated_at: attraction.updated_at.toISOString(),
      category: {
        ...attraction.category,
        created_at: attraction.category.created_at.toISOString(),
        updated_at: attraction.category.updated_at.toISOString(),
      },
      images: attraction.images.map((image) => ({
        ...image,
        created_at: image.created_at.toISOString(),
      })),
      activities: attraction.activities.map((activity) => ({
        ...activity,
        created_at: activity.created_at.toISOString(),
        updated_at: activity.updated_at.toISOString(),
      })),
      related_attractions: (attraction.relatedFrom || []).map((rel: any) => ({
        ...rel.related_attraction,
        created_at: rel.related_attraction.created_at.toISOString(),
        updated_at: rel.related_attraction.updated_at.toISOString(),
      })),
    };
  }

  async update(id: number, updateAttractionDto: UpdateAttractionDto & { is_published?: boolean; related_attraction_ids?: number[] }) {
    if (!id || id <= 0) {
      throw new BadRequestException('ID invalide');
    }

    const attractionExists = await this.prisma.attraction.findUnique({
      where: { id },
    });

    if (!attractionExists) {
      throw new NotFoundException(`Attraction avec l'ID ${id} non trouvée`);
    }

    const { name, description, category_id, image_url, thrill_level, duration, is_published, related_attraction_ids } = updateAttractionDto;

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

    // Préparer les données à mettre à jour
    const dataToUpdate: any = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (description !== undefined) dataToUpdate.description = description;
    if (category_id !== undefined) dataToUpdate.category_id = category_id;
    if (image_url !== undefined) dataToUpdate.image_url = image_url;
    if (thrill_level !== undefined) dataToUpdate.thrill_level = thrill_level;
    if (duration !== undefined) dataToUpdate.duration = duration;
    if (is_published !== undefined) dataToUpdate.is_published = is_published;

    // Gérer les attractions liées
    if (related_attraction_ids !== undefined) {
      // Supprimer les anciennes relations
      await (this.prisma as any).attractionRelation.deleteMany({
        where: { attraction_id: id },
      });

      // Créer les nouvelles relations
      if (related_attraction_ids.length > 0) {
        dataToUpdate.relatedFrom = {
          create: related_attraction_ids.map(relatedId => ({
            related_attraction_id: relatedId,
          })),
        };
      }
    }

    const updatedAttraction = await this.prisma.attraction.update({
      where: { id },
      data: dataToUpdate,
      include: {
        category: true,
        images: true,
        activities: true,
        relatedFrom: {
          include: {
            related_attraction: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    // Convertir les dates en ISO string
    return {
      ...updatedAttraction,
      created_at: updatedAttraction.created_at.toISOString(),
      updated_at: updatedAttraction.updated_at.toISOString(),
      category: {
        ...updatedAttraction.category,
        created_at: updatedAttraction.category.created_at.toISOString(),
        updated_at: updatedAttraction.category.updated_at.toISOString(),
      },
      images: updatedAttraction.images.map((image) => ({
        ...image,
        created_at: image.created_at.toISOString(),
      })),
      activities: updatedAttraction.activities.map((activity) => ({
        ...activity,
        created_at: activity.created_at.toISOString(),
        updated_at: activity.updated_at.toISOString(),
      })),
      related_attractions: (updatedAttraction.relatedFrom || []).map((rel: any) => ({
        ...rel.related_attraction,
        created_at: rel.related_attraction.created_at.toISOString(),
        updated_at: rel.related_attraction.updated_at.toISOString(),
      })),
    };
  }

  async remove(id: number) {
    if (!id || id <= 0) {
      throw new BadRequestException('ID invalide');
    }

    const attractionExists = await this.prisma.attraction.findUnique({
      where: { id },
    });

    if (!attractionExists) {
      throw new NotFoundException(`Attraction avec l'ID ${id} non trouvée`);
    }

    await this.prisma.attraction.delete({
      where: { id },
    });

    return { message: `Attraction avec l'ID ${id} supprimée avec succès` };
  }
}
