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
  async create(createMessageDto: CreateMessageDto, userId: number) {
    const { conversationId, recipientId, content } = createMessageDto;

    let finalConversationId: number;

    // CAS 1 : Conversation existante
    if (conversationId) {
      // Vérifier l'accès via ConversationService
      const hasAccess = await this.conversationService.userHasAccess(
          userId,
          conversationId,
      );

      if (!hasAccess) {
        throw new ForbiddenException('Vous ne faites pas partie de cette conversation');
      }

      finalConversationId = conversationId;
    }
    // CAS 2 : Nouvelle conversation
    else if (recipientId) {
      // Vérifier qu'on n'essaie pas de s'envoyer un message à soi-même
      if (recipientId === userId) {
        throw new BadRequestException('Vous ne pouvez pas vous envoyer un message à vous-même');
      }

      // Récupérer l'utilisateur actuel et le destinataire
      const [currentUser, recipient] = await Promise.all([
        this.prisma.user.findUnique({
          where: { id: userId },
          select: { role: true },
        }),
        this.prisma.user.findUnique({
          where: { id: recipientId },
          select: { role: true },
        }),
      ]);

      // Vérifier que le destinataire existe
      if (!recipient) {
        throw new NotFoundException('Destinataire non trouvé');
      }

      // RÈGLE 1 : Les admins ne peuvent pas créer de nouvelles conversations
      if (currentUser?.role === 'ADMIN') {
        throw new ForbiddenException(
            'Les administrateurs ne peuvent pas créer de nouvelles conversations. ' +
            'Veuillez répondre aux conversations existantes.'
        );
      }

      // RÈGLE 2 : Les clients ne peuvent envoyer qu'aux admins
      if (recipient.role !== 'ADMIN') {
        throw new BadRequestException(
            'Vous ne pouvez envoyer des messages qu\'aux administrateurs'
        );
      }

      // Créer ou récupérer la conversation via ConversationService
      const conversation = await this.conversationService.create(userId, recipientId);
      finalConversationId = conversation.id;
    }
    // CAS 3 : Ni conversationId ni recipientId
    else {
      throw new BadRequestException(
          'Vous devez fournir soit conversationId soit recipientId'
      );
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
      },
    });

    // Mettre à jour le timestamp de la conversation
    await this.conversationService.touch(finalConversationId);

    return message;
  }

  /**
   * Récupérer tous les messages d'une conversation
   */
  async findAllByConversationId(conversationId: number) {
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
  async markAsRead(conversationId: number, userId: number) {
    await this.prisma.message.updateMany({
      where: {
        conversation_id: conversationId,
        sender_id: { not: userId },
        is_read: false,
      },
      data: {
        is_read: true,
      },
    });
  }

  /**
   * Supprimer un message
   */
  async remove(id: number, userId: number) {
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
  }
}