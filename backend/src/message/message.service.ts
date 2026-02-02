// src/message/message.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConversationService } from '../conversation/conversation.service';
import { CreateMessageDto } from 'src/generated';

@Injectable()
export class MessageService {
  constructor(
      private prisma: PrismaService,
      private conversationService: ConversationService, // Injection du service conversation
  ) {}

  /**
   * Créer un message
   * @param createMessageDto - Données du message
   * @param userId - ID de l'expéditeur
   */
  // message.service.ts - Modifier la méthode create

  async create(createMessageDto: CreateMessageDto, userId: number) {
    const { conversationId, recipientId, content, object } = createMessageDto;

    let finalConversationId: number;

    // CAS 1 : Conversation existante
    if (conversationId) {
      const hasAccess = await this.conversationService.userHasAccess(
          userId,
          conversationId,
      );

      if (!hasAccess) {
        throw new ForbiddenException('Vous ne faites pas partie de cette conversation');
      }

      finalConversationId = conversationId;
    }
    // CAS 2 : Nouvelle conversation (avec ou sans recipientId)
    else {
      if (!object || object.trim().length === 0) {
        throw new BadRequestException('L\'objet de la conversation est requis pour créer une nouvelle conversation');
      }

      // Créer ou récupérer la conversation
      // Si recipientId est null/undefined, un admin sera assigné automatiquement
      const conversation = await this.conversationService.create(
          userId,
          recipientId ?? null, // null si non fourni = auto-assignation
          object
      );
      finalConversationId = conversation.id;
    }

    // Créer le message
    const message = await this.prisma.message.create({
      data: {
        conversation_id: finalConversationId,
        sender_id: userId,
        content,
        is_read: false,
      },
      include: {
        sender: {
          select: {
            id: true,
            pseudo: true,
            role: true,
            email: true,
          },
        },
        conversation: {
          select: {
            id: true,
            object: true,
            status: true,
            user: {
              select: {
                id: true,
                pseudo: true,
                role: true,
              },
            },
            admin: {
              select: {
                id: true,
                pseudo: true,
              }
            }
          },
        },
      },
    });

    // Mettre à jour le timestamp de la conversation
    await this.conversationService.touch(finalConversationId);

    return message;
  }

  /**
   * Récupérer tous les messages d'une conversation
   */
  async findAllByConversationId(conversationId: number, userId: number) {
    // Vérifie l'accès
    const hasAccess = await this.conversationService.userHasAccess(
        userId,
        conversationId,
    )

    if (!hasAccess) {
      throw new ForbiddenException('Vous ne faites pas partie de cette conversation');
    }

    return this.prisma.message.findMany({
      where: {conversation_id : conversationId},
      orderBy: {created_at: 'asc'},
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
    });
  }

  /**
   * Marquer les messages comme lus
   */
  async markMessageAsRead(messageId: number, userId: number) {
    // Récupérer le message pour vérifier
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: { conversation: true },
    });

    if (!message) {
      throw new NotFoundException('Message non trouvé');
    }

    // Vérifier que l'utilisateur est participant de la conversation
    const isParticipant =
        message.conversation.user_id === userId ||
        message.conversation.admin_id === userId;

    if (!isParticipant) {
      throw new ForbiddenException('Accès refusé à cette conversation');
    }

    // Vérifier que l'utilisateur n'est PAS l'expéditeur
    if (message.sender_id === userId) {
      throw new BadRequestException('Vous ne pouvez pas marquer vos propres messages comme lus');
    }

    // Marquer le message comme lu
    await this.prisma.message.update({
      where: { id: messageId },
      data: { is_read: true },
    });
  }

  /**
   * Archiver un message
   */
  async archive(id: number, userId: number) {
    const message = await this.prisma.message.findUnique({
      where: {id},
      include: {
        conversation: true,
        sender: true,
      }
    });

    if (!message) {
      throw new NotFoundException(`Message ${id} introuvable`);
    }

    if(message.sender_id !== userId){
      throw new ForbiddenException('Vous ne pouvez supprimer que vos propres messages');
    }

    if (message.conversation.status !== 'OPEN') {
      throw new BadRequestException('Impossible de supprimer un message d\'une conversation clôturée');
    }

    if (message.is_deleted) {
      throw new BadRequestException('Ce message est déjà supprimé');
    }

    const updatedMessage = await this.prisma.message.update({
      where: { id },
      data: {
        content: 'Message supprimé',
        is_deleted: true,
      },
    });

    return {
      success: true,
      message: 'Message supprimé avec succès',
      data: updatedMessage,
    };
  }

  /**
   * Supprimer un message
   */
  /*async remove(id: number, userId: number) {
    const message = await this.prisma.message.findUnique({
      where: { id },
      include: {
        sender: {
          select: { id: true, role: true },
        },
        conversation: {
          select: {
            user_id: true,
            admin_id: true,
          },
        },
      },
    });

    if (!message) {
      throw new NotFoundException(`Message ${id} introuvable`);
    }

    // Récupérer l'utilisateur actuel
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    // Vérifications d'autorisation
    const isSender = message.sender_id === userId;
    const isAdmin = currentUser?.role === 'ADMIN';
    const isParticipant =
        message.conversation.user_id === userId ||
        message.conversation.admin_id === userId;

    const canDelete = (isSender || isAdmin) && isParticipant;

    if (!canDelete) {
      throw new ForbiddenException('Non autorisé à supprimer ce message');
    }

    await this.prisma.message.delete({ where: { id } });

    return {
      success: true,
      message: 'Message supprimé',
    };
  }*/
}