import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateCategoryDto, UpdateCategoryDto } from 'src/generated';
import {
  transformTranslatableFields,
  type Language,
} from '../common/translations.util';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  private formatCategoryResponse(category: any, lang: Language = 'fr') {
    const transformed = transformTranslatableFields(category, lang);
    return {
      ...transformed,
      created_at: category.created_at.toISOString(),
      updated_at: category.updated_at.toISOString(),
    };
  }

  async findAll(lang: Language = 'fr') {
    const categories = await this.prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            attractions: true,
            activities: true,
          },
        },
      },
    });

    return categories.map((category) => this.formatCategoryResponse(category, lang));
  }

  async findOne(id: number, lang: Language = 'fr') {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        attractions: {
          select: {
            id: true,
            name: true,
            description: true,
            image_url: true,
          },
        },
        activities: {
          select: {
            id: true,
            name: true,
            description: true,
            image_url: true,
          },
        },
        _count: {
          select: {
            attractions: true,
            activities: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Catégorie avec l'ID ${id} non trouvée`);
    }

    // Transformer les attractions et activités incluses
    const transformedCategory = transformTranslatableFields(category, lang);
    const result: any = {
      ...this.formatCategoryResponse(transformedCategory, lang),
    };
    
    if (category.attractions && Array.isArray(category.attractions)) {
      result.attractions = category.attractions.map((attraction: any) =>
        transformTranslatableFields(attraction, lang),
      );
    }
    
    if (category.activities && Array.isArray(category.activities)) {
      result.activities = category.activities.map((activity: any) =>
        transformTranslatableFields(activity, lang),
      );
    }
    
    return result;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const { name, description } = createCategoryDto;

    if (!name || !description) {
      throw new BadRequestException(
        'Les champs name et description sont requis',
      );
    }

    const existingCategory = await this.prisma.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      throw new ConflictException(
        `Une catégorie avec le nom "${name}" existe déjà`,
      );
    }

    const category = await this.prisma.category.create({
      data: { name, description },
      include: {
        _count: {
          select: {
            attractions: true,
            activities: true,
          },
        },
      },
    });

    return this.formatCategoryResponse(category);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Catégorie avec l'ID ${id} non trouvée`);
    }

    if (updateCategoryDto.name) {
      const existingCategory = await this.prisma.category.findUnique({
        where: { name: updateCategoryDto.name },
      });

      if (existingCategory && existingCategory.id !== id) {
        throw new ConflictException(
          `Une catégorie avec le nom "${updateCategoryDto.name}" existe déjà`,
        );
      }
    }

    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
      include: {
        _count: {
          select: {
            attractions: true,
            activities: true,
          },
        },
      },
    });

    return this.formatCategoryResponse(updatedCategory);
  }

  async remove(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            attractions: true,
            activities: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Catégorie avec l'ID ${id} non trouvée`);
    }

    if (category._count.attractions > 0 || category._count.activities > 0) {
      throw new BadRequestException(
        `Impossible de supprimer la catégorie "${category.name}" car elle est utilisée par ${category._count.attractions} attraction(s) et ${category._count.activities} activité(s)`,
      );
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return {
      message: `Catégorie "${category.name}" supprimée avec succès`,
    };
  }
}
