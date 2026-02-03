import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConversationService } from '../conversation/conversation.service';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

describe('MessageService', () => {
  let service: MessageService;

  const mockPrismaService = {
    message: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    conversation: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };

  const mockConversationService = {
    findOne: jest.fn(),
    userHasAccess: jest.fn(),
    create: jest.fn(),
    touch: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ConversationService,
          useValue: mockConversationService,
        },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('devrait créer un message dans une conversation existante', async () => {
      const createDto = {
        conversation_id: 1,
        content: 'Bonjour',
      };
      const userId = 1;

      const mockConversation = {
        id: 1,
        status: 'OPEN',
        user: { id: 1 },
        admin: { id: 2 },
      };

      const mockMessage = {
        id: 1,
        conversation_id: 1,
        sender_id: userId,
        content: 'Bonjour',
        sender: { id: 1, pseudo: 'user1' },
        conversation: mockConversation,
      };

      mockConversationService.userHasAccess.mockResolvedValue(true);
      mockConversationService.findOne.mockResolvedValue(mockConversation);
      mockPrismaService.message.create.mockResolvedValue(mockMessage);

      const result = await service.create(createDto as any, userId);

      expect(result).toEqual(mockMessage);
      expect(mockConversationService.touch).toHaveBeenCalledWith(1);
    });

    it('devrait créer une nouvelle conversation si conversation_id absent', async () => {
      const createDto = {
        recipient_id: 2,
        content: 'Nouveau message',
        object: 'Question',
      };
      const userId = 1;

      const mockConversation = {
        id: 5,
        user_id: 1,
        admin_id: 2,
        status: 'OPEN',
      };

      const mockMessage = {
        id: 10,
        conversation_id: 5,
        sender_id: userId,
        content: 'Nouveau message',
        sender: { id: 1, pseudo: 'user1' },
        conversation: mockConversation,
      };

      mockConversationService.create.mockResolvedValue(mockConversation);
      mockPrismaService.message.create.mockResolvedValue(mockMessage);

      const result = await service.create(createDto as any, userId);

      expect(result).toEqual(mockMessage);
      expect(mockConversationService.create).toHaveBeenCalledWith(
        userId,
        2,
        'Question',
      );
      expect(mockConversationService.touch).toHaveBeenCalledWith(5);
    });

    it('devrait auto-assigner un admin si recipient_id absent', async () => {
      const createDto = {
        content: 'Message',
        object: 'Aide',
      };
      const userId = 1;

      const mockConversation = {
        id: 6,
        user_id: 1,
        admin_id: 3,
        status: 'OPEN',
      };

      const mockMessage = {
        id: 11,
        conversation_id: 6,
        sender_id: userId,
        content: 'Message',
        sender: { id: 1, pseudo: 'user1' },
        conversation: mockConversation,
      };

      mockConversationService.create.mockResolvedValue(mockConversation);
      mockPrismaService.message.create.mockResolvedValue(mockMessage);

      const result = await service.create(createDto as any, userId);

      expect(mockConversationService.create).toHaveBeenCalledWith(
        userId,
        null,
        'Aide',
      );
    });

    it('devrait lancer ForbiddenException si pas accès à la conversation', async () => {
      const createDto = {
        conversation_id: 1,
        content: 'Test',
      };

      mockConversationService.userHasAccess.mockResolvedValue(false);

      await expect(service.create(createDto as any, 1)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(service.create(createDto as any, 1)).rejects.toThrow(
        'Vous ne faites pas partie de cette conversation',
      );
    });

    it('devrait lancer ForbiddenException si conversation clôturée', async () => {
      const createDto = {
        conversation_id: 1,
        content: 'Test',
      };

      const mockConversation = {
        id: 1,
        status: 'CLOSED',
      };

      mockConversationService.userHasAccess.mockResolvedValue(true);
      mockConversationService.findOne.mockResolvedValue(mockConversation);

      await expect(service.create(createDto as any, 1)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(service.create(createDto as any, 1)).rejects.toThrow(
        'Vous ne pouvez pas créer de nouveau message sur une conversation clôturée',
      );
    });

    it('devrait lancer BadRequestException si object manquant pour nouvelle conversation', async () => {
      const createDto = {
        content: 'Message sans objet',
      };

      await expect(service.create(createDto as any, 1)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(createDto as any, 1)).rejects.toThrow(
        'L\'objet de la conversation est requis',
      );
    });
  });

  describe('findAllByConversationId', () => {
    it('devrait retourner tous les messages d\'une conversation', async () => {
      const mockMessages = [
        { id: 1, content: 'Message 1', sender: { id: 1, pseudo: 'user1' } },
        { id: 2, content: 'Message 2', sender: { id: 2, pseudo: 'admin1' } },
      ];

      mockConversationService.userHasAccess.mockResolvedValue(true);
      mockPrismaService.message.findMany.mockResolvedValue(mockMessages);

      const result = await service.findAllByConversationId(1, 1);

      expect(result).toEqual(mockMessages);
      expect(mockPrismaService.message.findMany).toHaveBeenCalledWith({
        where: { conversation_id: 1 },
        orderBy: { created_at: 'asc' },
        include: expect.any(Object),
      });
    });

    it('devrait lancer ForbiddenException si pas accès', async () => {
      mockConversationService.userHasAccess.mockResolvedValue(false);

      await expect(service.findAllByConversationId(1, 999)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('markMessageAsRead', () => {
    it('devrait marquer un message comme lu', async () => {
      const mockMessage = {
        id: 1,
        sender_id: 2,
        conversation: { user_id: 1, admin_id: 2 },
      };

      mockPrismaService.message.findUnique.mockResolvedValue(mockMessage);
      mockPrismaService.message.update.mockResolvedValue({});

      await service.markMessageAsRead(1, 1);

      expect(mockPrismaService.message.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { is_read: true },
      });
    });

    it('devrait lancer NotFoundException si message introuvable', async () => {
      mockPrismaService.message.findUnique.mockResolvedValue(null);

      await expect(service.markMessageAsRead(999, 1)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.markMessageAsRead(999, 1)).rejects.toThrow(
        'Message non trouvé',
      );
    });

    it('devrait lancer ForbiddenException si pas participant', async () => {
      const mockMessage = {
        id: 1,
        sender_id: 2,
        conversation: { user_id: 3, admin_id: 4 },
      };

      mockPrismaService.message.findUnique.mockResolvedValue(mockMessage);

      await expect(service.markMessageAsRead(1, 999)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(service.markMessageAsRead(1, 999)).rejects.toThrow(
        'Accès refusé à cette conversation',
      );
    });

    it('devrait lancer BadRequestException si utilisateur est expéditeur', async () => {
      const mockMessage = {
        id: 1,
        sender_id: 1,
        conversation: { user_id: 1, admin_id: 2 },
      };

      mockPrismaService.message.findUnique.mockResolvedValue(mockMessage);

      await expect(service.markMessageAsRead(1, 1)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.markMessageAsRead(1, 1)).rejects.toThrow(
        'Vous ne pouvez pas marquer vos propres messages comme lus',
      );
    });
  });

  describe('archive', () => {
    it('devrait archiver un message', async () => {
      const mockMessage = {
        id: 1,
        sender_id: 1,
        is_deleted: false,
        conversation: { status: 'OPEN' },
        sender: { id: 1 },
      };

      const mockUpdated = {
        ...mockMessage,
        content: 'Message supprimé',
        is_deleted: true,
      };

      mockPrismaService.message.findUnique.mockResolvedValue(mockMessage);
      mockPrismaService.message.update.mockResolvedValue(mockUpdated);

      const result = await service.archive(1, 1);

      expect(result).toBeDefined();
      expect(mockPrismaService.message.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          content: 'Message supprimé',
          is_deleted: true,
        },
      });
    });

    it('devrait lancer NotFoundException si message introuvable', async () => {
      mockPrismaService.message.findUnique.mockResolvedValue(null);

      await expect(service.archive(999, 1)).rejects.toThrow(NotFoundException);
      await expect(service.archive(999, 1)).rejects.toThrow(
        'Message 999 introuvable',
      );
    });

    it('devrait lancer ForbiddenException si pas propriétaire', async () => {
      const mockMessage = {
        id: 1,
        sender_id: 2,
        conversation: { status: 'OPEN' },
        sender: { id: 2 },
      };

      mockPrismaService.message.findUnique.mockResolvedValue(mockMessage);

      await expect(service.archive(1, 1)).rejects.toThrow(ForbiddenException);
      await expect(service.archive(1, 1)).rejects.toThrow(
        'Vous ne pouvez supprimer que vos propres messages',
      );
    });

    it('devrait lancer BadRequestException si conversation clôturée', async () => {
      const mockMessage = {
        id: 1,
        sender_id: 1,
        conversation: { status: 'CLOSED' },
        sender: { id: 1 },
      };

      mockPrismaService.message.findUnique.mockResolvedValue(mockMessage);

      await expect(service.archive(1, 1)).rejects.toThrow(BadRequestException);
      await expect(service.archive(1, 1)).rejects.toThrow(
        'Impossible de supprimer un message d\'une conversation clôturée',
      );
    });

    it('devrait lancer BadRequestException si déjà supprimé', async () => {
      const mockMessage = {
        id: 1,
        sender_id: 1,
        is_deleted: true,
        conversation: { status: 'OPEN' },
        sender: { id: 1 },
      };

      mockPrismaService.message.findUnique.mockResolvedValue(mockMessage);

      await expect(service.archive(1, 1)).rejects.toThrow(BadRequestException);
      await expect(service.archive(1, 1)).rejects.toThrow(
        'Ce message est déjà supprimé',
      );
    });
  });
});
