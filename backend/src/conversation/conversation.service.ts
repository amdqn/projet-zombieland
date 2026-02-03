import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConversationStatus } from '../generated';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  /**
   * Trouver un admin disponible (round-robin ou premier trouvé)
   */
  private async findAvailableAdmin(): Promise<number> {
    // Option 1 : Prendre le premier admin trouvé
    const admin = await this.prisma.user.findFirst({
      where: { role: 'ADMIN' },
      select: { id: true },
    });

    if (!admin) {
      throw new NotFoundException('Aucun administrateur disponible');
    }

    return admin.id;
  }

  /**
   * Créer une nouvelle conversation entre un user et un admin
   * @param userId - ID de l'utilisateur (CLIENT)
   * @param adminId - ID de l'admin - Si adminId n'est pas fourni, un admin sera assigné automatiquement
   * @param object - Objet de la conversation
   */
  async create(userId: number, adminId: number | null, object: string) {
    // Si pas d'adminId fourni, trouver un admin automatiquement
    const finalAdminId = adminId ?? (await this.findAvailableAdmin());

    // Vérifier que l'admin existe et est bien un ADMIN
    if (userId === adminId) {
      throw new BadRequestException(
        'Vous ne pouvez pas créer une conversation avec vous-même. ',
      );
    }

    const [user, admin] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true, pseudo: true },
      }),
      this.prisma.user.findUnique({
        where: { id: finalAdminId },
        select: { id: true, role: true, pseudo: true },
      }),
    ]);

    if (!admin) {
      throw new NotFoundException('Admin non trouvé');
    }

    if (admin.role !== 'ADMIN') {
      throw new BadRequestException(
        'Le destinataire doit être un administrateur',
      );
    }

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Vérifier qu'une conversation active n'existe pas déjà
    const existingConversation = await this.prisma.conversation.findFirst({
      where: {
        user_id: userId,
        admin_id: adminId,
        status: {
          not: ConversationStatus.Closed,
        },
      },
      include: {
        user: {
          select: { id: true, pseudo: true, role: true, email: true },
        },
        admin: {
          select: { id: true, pseudo: true, role: true, email: true },
        },
      },
    });

    if (existingConversation) {
      return existingConversation;
    }

    // Créer la nouvelle conversation
    return this.prisma.conversation.create({
      data: {
        user_id: userId,
        admin_id: finalAdminId,
        status: ConversationStatus.Open,
        object: object,
      },
      include: {
        user: {
          select: { id: true, pseudo: true, role: true, email: true },
        },
        admin: {
          select: { id: true, pseudo: true, role: true, email: true },
        },
      },
    });
  }

  /**
   * Récupérer une conversation par son ID
   * @param conversationId - ID de la conversation
   */
  async findOne(conversationId: number) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        user: {
          select: { id: true, pseudo: true, role: true, email: true },
        },
        admin: {
          select: { id: true, pseudo: true, role: true, email: true },
        },
        messages: {
          orderBy: { created_at: 'asc' },
          include: {
            sender: {
              select: {
                id: true,
                pseudo: true,
                role: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation non trouvée');
    }

    return conversation;
  }
  // TODO ajouter une règle pour que si le statut est cloturé de la conv, on ne puisse plus créer de message
  /**
   * Récupérer toutes les conversations d'un utilisateur
   * @param userId - ID de l'utilisateur
   * @param userRole - Rôle de l'utilisateur
   */
  async findByUser(userId: number, userRole: string) {
    const where =
      userRole === 'ADMIN'
        ? {
            OR: [{ admin_id: userId }, { status: ConversationStatus.Open }],
          }
        : { user_id: userId };

    return this.prisma.conversation.findMany({
      where,
      include: {
        user: {
          select: { id: true, pseudo: true, role: true, email: true },
        },
        admin: {
          select: { id: true, pseudo: true, role: true, email: true },
        },
        messages: {
          orderBy: { created_at: 'asc' },
          select: {
            id: true,
            content: true,
            created_at: true,
            is_read: true,
            sender: {
              select: {
                id: true,
                pseudo: true,
                role: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            messages: {
              where: {
                is_read: false,
                sender_id: { not: userId }, // Messages non lus des autres
              },
            },
          },
        },
      },
      orderBy: { updated_at: 'desc' },
    });
  }

  /**
   * Vérifier si un utilisateur a accès à une conversation
   */
  async userHasAccess(
    userId: number,
    conversationId: number,
  ): Promise<boolean> {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ user_id: userId }, { admin_id: userId }],
      },
    });

    return conversation !== null;
  }

  /**
   * Mettre à jour le statut d'une conversation (ADMIN uniquement)
   * @param conversationId - ID de la conversation
   * @param status - Nouveau statut
   * @param adminId - ID de l'admin qui effectue l'action
   */
  async updateStatus(
    conversationId: number,
    status: ConversationStatus,
    adminId: number,
  ) {
    const conversation = await this.findOne(conversationId);

    // Vérifier que l'admin a accès à cette conversation
    if (conversation.admin_id !== adminId) {
      throw new ForbiddenException(
        "Vous n'avez pas accès à cette conversation",
      );
    }

    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: { status },
      include: {
        user: {
          select: { id: true, pseudo: true, role: true },
        },
        admin: {
          select: { id: true, pseudo: true, role: true },
        },
      },
    });
  }

  /**
   * Mettre à jour le timestamp updated_at de la conversation
   */
  async touch(conversationId: number) {
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updated_at: new Date() },
    });
  }
}
