import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreatePriceDto, UpdatePriceDto } from 'src/generated';

@Injectable()
export class PricesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Helper DRY : Formate la réponse d'un tarif
   * Convertit les dates en ISO et amount (Decimal) en number
   */
  private formatPriceResponse(price: any) {
    return {
      ...price,
      amount: parseFloat(price.amount.toString()),
      created_at: price.created_at.toISOString(),
      updated_at: price.updated_at.toISOString(),
    };
  }

  async findAll() {
    const prices = await this.prisma.price.findMany({
      orderBy: { amount: 'asc' },
    });

    return prices.map((price) => this.formatPriceResponse(price));
  }
  async findOne(id: number) {
    const price = await this.prisma.price.findUnique({
      where: { id },
    });

    if (!price) {
      throw new NotFoundException(`Tarif avec l'ID ${id} non trouvé`);
    }

    return this.formatPriceResponse(price);
  }

  async create(createPriceDto: CreatePriceDto) {
    const { label, type, amount, duration_days } = createPriceDto;

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

    if (updatePriceDto.duration_days !== undefined && updatePriceDto.duration_days < 1) {
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
