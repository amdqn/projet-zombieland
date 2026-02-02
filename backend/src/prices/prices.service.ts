import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreatePriceDto, UpdatePriceDto } from 'src/generated';
import {Prisma, PriceType} from "@prisma/client";
import {
  transformTranslatableFields,
  type Language,
} from '../common/translations.util';

@Injectable()
export class PricesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Helper DRY : Formate la réponse d'un tarif
   * Convertit les dates en ISO et amount (Decimal) en number
   */
  private formatPriceResponse(price: any, lang: Language = 'fr') {
    const transformed = transformTranslatableFields(price, lang);
    return {
      ...transformed,
      amount: parseFloat(price.amount.toString()),
      created_at: price.created_at.toISOString(),
      updated_at: price.updated_at.toISOString(),
    };
  }

  async findAll(
      options?: {
        page?: number;
        limit?: number;
        sortBy?: string;
        amount?: number;
        priceType?: string;
      },
      lang: Language = 'fr',
  ) {

    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    // Construction des filtres avec typage strict
    const where: Prisma.PriceWhereInput = {};

    // Recherche par type de prix
    const validTypes = Object.values(PriceType);
    if (validTypes.includes(options?.priceType as PriceType)) {
      where.type = options?.priceType as PriceType;
    }

    // Recherche par montant
    if (options?.amount !== undefined) {
      where.amount = options.amount;
    }

    // Mapping du tri
    const orderByMapping: Record<string, Prisma.PriceOrderByWithRelationInput> = {
      'created_desc': { created_at: 'desc' },
      'created_asc': { created_at: 'asc' },
      'amount_desc': { amount: 'desc' },
      'amount_asc': { amount: 'asc' },
      'updated_desc': { updated_at: 'desc' },
      'updated_asc': { updated_at: 'asc' },
    };

    const sortBy = options?.sortBy || 'created_desc';
    const orderBy = orderByMapping[sortBy] || orderByMapping['created_desc'];

    // Requête avec pagination
    const [prices, total] = await Promise.all([
      this.prisma.price.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.price.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: prices.map((price) => this.formatPriceResponse(price, lang)),
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async findOne(id: number, lang: Language = 'fr') {
    const price = await this.prisma.price.findUnique({
      where: { id },
    });

    if (!price) {
      throw new NotFoundException(`Tarif avec l'ID ${id} non trouvé`);
    }

    return this.formatPriceResponse(price, lang);
  }

  async create(createPriceDto: CreatePriceDto) {
    const { label, label_en, type, amount, duration_days } = createPriceDto as any;

    if (!label || !type || !amount || !duration_days) {
      throw new BadRequestException('Tous les champs sont requis');
    }

    if (amount <= 0) {
      throw new BadRequestException('Le montant doit être supérieur à 0');
    }

    if (duration_days < 1) {
      throw new BadRequestException('La durée doit être au moins 1 jour');
    }

    const price = await this.prisma.price.create({
      data: {
        label,
        label_en: label_en || null,
        type,
        amount,
        duration_days,
      },
    });

    return this.formatPriceResponse(price);
  }

  async update(id: number, updatePriceDto: UpdatePriceDto) {
    const price = await this.prisma.price.findUnique({
      where: { id },
    });

    if (!price) {
      throw new NotFoundException(`Tarif avec l'ID ${id} non trouvé`);
    }

    if (updatePriceDto.amount !== undefined && updatePriceDto.amount <= 0) {
      throw new BadRequestException('Le montant doit être supérieur à 0');
    }

    if (
      updatePriceDto.duration_days !== undefined &&
      updatePriceDto.duration_days < 1
    ) {
      throw new BadRequestException('La durée doit être au moins 1 jour');
    }

    const updatedPrice = await this.prisma.price.update({
      where: { id },
      data: updatePriceDto,
    });

    return this.formatPriceResponse(updatedPrice);
  }

  async remove(id: number) {
    const price = await this.prisma.price.findUnique({
      where: { id },
    });

    if (!price) {
      throw new NotFoundException(`Tarif avec l'ID ${id} non trouvé`);
    }

    // Note: Avec le nouveau système tickets JSON, on ne peut plus vérifier facilement
    // si un tarif est utilisé. Cette vérification pourrait être ajoutée avec une requête
    // raw SQL si nécessaire.

    await this.prisma.price.delete({
      where: { id },
    });

    return {
      message: `Tarif "${price.label}" supprimé avec succès`,
    };
  }
}
