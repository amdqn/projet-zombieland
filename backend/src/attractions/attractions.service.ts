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
import { AttractionMapper } from './mappers/attraction.mapper';

@Injectable()
export class AttractionsService {
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
      } as any,
      orderBy: {
        created_at: 'desc',
      },
    });

    return attractions.map((attraction: any) => {
      const transformedAttraction = transformTranslatableFields(
        attraction,
        lang,
      );
      return {
        ...AttractionMapper.toDto(transformedAttraction),
        wait_time: this.generateWaitTime(attraction.thrill_level),
        category: {
          ...transformTranslatableFields(attraction.category, lang),
          created_at: attraction.category.created_at.toISOString(),
          updated_at: attraction.category.updated_at.toISOString(),
        },
        images: attraction.images.map((image) => ({
          ...transformTranslatableFields(image, lang),
          created_at: image.created_at.toISOString(),
        })),
        activities: attraction.activities.map((activity: any) => ({
          ...transformTranslatableFields(activity, lang),
          created_at: activity.created_at.toISOString(),
          updated_at: activity.updated_at.toISOString(),
        })),
        related_attractions: attraction.relatedFrom
          ? attraction.relatedFrom.map((rel: any) => ({
              ...transformTranslatableFields(rel.related_attraction, lang),
              created_at: rel.related_attraction.created_at.toISOString(),
              updated_at: rel.related_attraction.updated_at.toISOString(),
              category: {
                ...transformTranslatableFields(
                  rel.related_attraction.category,
                  lang,
                ),
                created_at:
                  rel.related_attraction.category.created_at.toISOString(),
                updated_at:
                  rel.related_attraction.category.updated_at.toISOString(),
              },
            }))
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
      } as any,
    });

    if (!attraction) {
      throw new NotFoundException(`Attraction avec l'ID ${id} non trouvée`);
    }

    const transformedAttraction = transformTranslatableFields(
      attraction as any,
      lang,
    );
    return {
      ...AttractionMapper.toDto(transformedAttraction),
      wait_time: this.generateWaitTime((attraction as any).thrill_level),
      category: {
        ...transformTranslatableFields((attraction as any).category, lang),
        created_at: (attraction.category as any).created_at.toISOString(),
        updated_at: (attraction.category as any).updated_at.toISOString(),
      },
      images: attraction.images.map((image) => ({
        ...transformTranslatableFields(image, lang),
        created_at: image.created_at.toISOString(),
      })),
      activities: attraction.activities.map((activity) => ({
        ...transformTranslatableFields(activity, lang),
        created_at: activity.created_at.toISOString(),
        updated_at: activity.updated_at.toISOString(),
      })),
      related_attractions: (attraction.relatedFrom || []).map((rel: any) => ({
        ...transformTranslatableFields(rel.related_attraction, lang),
        created_at: rel.related_attraction.created_at.toISOString(),
        updated_at: rel.related_attraction.updated_at.toISOString(),
        category: {
          ...transformTranslatableFields(rel.related_attraction.category, lang),
          created_at:
            rel.related_attraction.category.created_at.toISOString(),
          updated_at:
            rel.related_attraction.category.updated_at.toISOString(),
        },
      })),
    };
  }

  async create(createAttractionDto: CreateAttractionDto & { is_published?: boolean; related_attraction_ids?: number[] }) {
    const { name, description, name_en, description_en, category_id, image_url, thrill_level, duration, is_published, related_attraction_ids } = createAttractionDto as any;

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
      name_en: name_en || null,
      description_en: description_en || null,
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
      } as any,
    });

    const createdAttraction = attraction as any;
    const transformedAttraction = transformTranslatableFields(
      createdAttraction,
      'fr',
    );
    return {
      ...AttractionMapper.toDto(transformedAttraction),
      category: {
        ...transformTranslatableFields(createdAttraction.category, 'fr'),
        created_at: createdAttraction.category.created_at.toISOString(),
        updated_at: createdAttraction.category.updated_at.toISOString(),
      },
      images: createdAttraction.images.map((image: any) => ({
        ...transformTranslatableFields(image, 'fr'),
        created_at: image.created_at.toISOString(),
      })),
      activities: createdAttraction.activities.map((activity: any) => ({
        ...transformTranslatableFields(activity, 'fr'),
        created_at: activity.created_at.toISOString(),
        updated_at: activity.updated_at.toISOString(),
      })),
      related_attractions: (createdAttraction.relatedFrom || []).map((rel: any) => ({
        ...transformTranslatableFields(rel.related_attraction, 'fr'),
        created_at: rel.related_attraction.created_at.toISOString(),
        updated_at: rel.related_attraction.updated_at.toISOString(),
        category: rel.related_attraction.category
          ? {
              ...transformTranslatableFields(
                rel.related_attraction.category,
                'fr',
              ),
              created_at:
                rel.related_attraction.category.created_at.toISOString(),
              updated_at:
                rel.related_attraction.category.updated_at.toISOString(),
            }
          : undefined,
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
      } as any,
    });

    const updatedData = updatedAttraction as any;
    const transformedAttraction = transformTranslatableFields(
      updatedData,
      'fr',
    );
    return {
      ...AttractionMapper.toDto(transformedAttraction),
      category: {
        ...transformTranslatableFields(updatedData.category, 'fr'),
        created_at: updatedData.category.created_at.toISOString(),
        updated_at: updatedData.category.updated_at.toISOString(),
      },
      images: updatedData.images.map((image: any) => ({
        ...transformTranslatableFields(image, 'fr'),
        created_at: image.created_at.toISOString(),
      })),
      activities: updatedData.activities.map((activity: any) => ({
        ...transformTranslatableFields(activity, 'fr'),
        created_at: activity.created_at.toISOString(),
        updated_at: activity.updated_at.toISOString(),
      })),
      related_attractions: (updatedData.relatedFrom || []).map((rel: any) => ({
        ...transformTranslatableFields(rel.related_attraction, 'fr'),
        created_at: rel.related_attraction.created_at.toISOString(),
        updated_at: rel.related_attraction.updated_at.toISOString(),
        category: rel.related_attraction.category
          ? {
              ...transformTranslatableFields(
                rel.related_attraction.category,
                'fr',
              ),
              created_at:
                rel.related_attraction.category.created_at.toISOString(),
              updated_at:
                rel.related_attraction.category.updated_at.toISOString(),
            }
          : undefined,
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
