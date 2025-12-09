import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateAttractionDto, UpdateAttractionDto } from 'src/generated';

@Injectable()
export class AttractionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: { search?: string; categoryId?: number }) {
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
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Convertir les dates en ISO string
    return attractions.map((attraction) => ({
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
    }));
  }

  async findOne(id: number) {
    if (!id || id <= 0) {
      throw new BadRequestException('ID invalide');
    }

    const attraction = await this.prisma.attraction.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        activities: true,
      },
    });

    if (!attraction) {
      throw new NotFoundException(`Attraction avec l'ID ${id} non trouvée`);
    }

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
    };
  }

  async create(createAttractionDto: CreateAttractionDto) {
    const { name, description, category_id } = createAttractionDto;

    // Validation des champs requis
    if (!name || !description || !category_id) {
      throw new BadRequestException(
        'Le nom, la description et la catégorie sont requis',
      );
    }

    // Vérifier que la catégorie existe
    const categoryExists = await this.prisma.category.findUnique({
      where: { id: category_id },
    });

    if (!categoryExists) {
      throw new NotFoundException(
        `Catégorie avec l'ID ${category_id} non trouvée`,
      );
    }

    // Créer l'attraction
    const attraction = await this.prisma.attraction.create({
      data: {
        name,
        description,
        category_id,
      },
      include: {
        category: true,
        images: true,
        activities: true,
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
    };
  }

  async update(id: number, updateAttractionDto: UpdateAttractionDto) {
    if (!id || id <= 0) {
      throw new BadRequestException('ID invalide');
    }

    // Vérifier que l'attraction existe
    const attractionExists = await this.prisma.attraction.findUnique({
      where: { id },
    });

    if (!attractionExists) {
      throw new NotFoundException(`Attraction avec l'ID ${id} non trouvée`);
    }

    const { name, description, category_id } = updateAttractionDto;

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

    // Mettre à jour l'attraction
    const updatedAttraction = await this.prisma.attraction.update({
      where: { id },
      data: dataToUpdate,
      include: {
        category: true,
        images: true,
        activities: true,
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
    };
  }

  async remove(id: number) {
    if (!id || id <= 0) {
      throw new BadRequestException('ID invalide');
    }

    // Vérifier que l'attraction existe
    const attractionExists = await this.prisma.attraction.findUnique({
      where: { id },
    });

    if (!attractionExists) {
      throw new NotFoundException(`Attraction avec l'ID ${id} non trouvée`);
    }

    // Supprimer l'attraction
    await this.prisma.attraction.delete({
      where: { id },
    });

    return { message: `Attraction avec l'ID ${id} supprimée avec succès` };
  }
}