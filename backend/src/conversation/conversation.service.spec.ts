import { Test, TestingModule } from '@nestjs/testing';
import { ConversationService } from './conversation.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ConversationStatus } from '../generated';

describe('ConversationService', () => {
  let service: ConversationService;

  const mockPrismaService = {
    conversation: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    message: {
      findMany: jest.fn(),
    },
    user: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ConversationService>(ConversationService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('devrait créer une nouvelle conversation avec un admin spécifique', async () => {
      const userId = 1;
      const adminId = 2;
      const object = 'Question sur réservation';

      const mockUser = { id: userId, role: 'USER', pseudo: 'user1' };
      const mockAdmin = { id: adminId, role: 'ADMIN', pseudo: 'admin1' };
      const mockConversation = {
        id: 1,
        user_id: userId,
        admin_id: adminId,
        object,
        status: ConversationStatus.Open,
        user: mockUser,
        admin: mockAdmin,
      };

      mockPrismaService.user.findUnique
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(mockAdmin);
      mockPrismaService.conversation.findFirst.mockResolvedValue(null);
      mockPrismaService.conversation.create.mockResolvedValue(mockConversation);

      const result = await service.create(userId, adminId, object);

      expect(result).toEqual(mockConversation);
      expect(mockPrismaService.conversation.create).toHaveBeenCalledWith({
        data: {
          user_id: userId,
          admin_id: adminId,
          status: ConversationStatus.Open,
          object,
        },
        include: expect.any(Object),
      });
    });

    it('devrait assigner automatiquement un admin si adminId est null', async () => {
      const userId = 1;
      const object = 'Question';

      const mockUser = { id: userId, role: 'USER', pseudo: 'user1' };
      const mockAdmin = { id: 3, role: 'ADMIN', pseudo: 'admin_auto' };
      const mockConversation = {
        id: 2,
        user_id: userId,
        admin_id: 3,
        object,
        status: ConversationStatus.Open,
        user: mockUser,
        admin: mockAdmin,
      };

      mockPrismaService.user.findFirst.mockResolvedValue(mockAdmin);
      mockPrismaService.user.findUnique
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(mockAdmin);
      mockPrismaService.conversation.findFirst.mockResolvedValue(null);
      mockPrismaService.conversation.create.mockResolvedValue(mockConversation);

      const result = await service.create(userId, null, object);

      expect(result.admin_id).toBe(3);
      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: { role: 'ADMIN' },
        select: { id: true },
      });
    });

    it('devrait lancer NotFoundException si aucun admin disponible', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      await expect(service.create(1, null, 'Question')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.create(1, null, 'Question')).rejects.toThrow(
        'Aucun administrateur disponible',
      );
    });

    it('devrait lancer BadRequestException si userId === adminId', async () => {
      await expect(service.create(1, 1, 'Test')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(1, 1, 'Test')).rejects.toThrow(
        'Vous ne pouvez pas créer une conversation avec vous-même',
      );
    });

    it('devrait lancer NotFoundException si admin non trouvé', async () => {
      const mockUser = { id: 1, role: 'USER', pseudo: 'user1' };

      mockPrismaService.user.findUnique
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(null);

      await expect(service.create(1, 2, 'Test')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.create(1, 2, 'Test')).rejects.toThrow(
        'Admin non trouvé',
      );
    });

    it('devrait lancer BadRequestException si destinataire n\'est pas ADMIN', async () => {
      const mockUser1 = { id: 1, role: 'USER', pseudo: 'user1' };
      const mockUser2 = { id: 2, role: 'USER', pseudo: 'user2' };

      mockPrismaService.user.findUnique.mockImplementation((args) => {
        if (args.where.id === 1) return Promise.resolve(mockUser1);
        if (args.where.id === 2) return Promise.resolve(mockUser2);
      });

      await expect(service.create(1, 2, 'Test')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(1, 2, 'Test')).rejects.toThrow(
        'Le destinataire doit être un administrateur',
      );
    });

    it('devrait lancer NotFoundException si utilisateur non trouvé', async () => {
      const mockAdmin = { id: 2, role: 'ADMIN', pseudo: 'admin1' };

      mockPrismaService.user.findUnique.mockImplementation((args) => {
        if (args.where.id === 1) return Promise.resolve(null);
        if (args.where.id === 2) return Promise.resolve(mockAdmin);
      });

      await expect(service.create(1, 2, 'Test')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.create(1, 2, 'Test')).rejects.toThrow(
        'Utilisateur non trouvé',
      );
    });

    it('devrait retourner conversation existante si déjà active', async () => {
      const mockUser = { id: 1, role: 'USER', pseudo: 'user1' };
      const mockAdmin = { id: 2, role: 'ADMIN', pseudo: 'admin1' };
      const existingConv = {
        id: 5,
        user_id: 1,
        admin_id: 2,
        status: ConversationStatus.Open,
        user: mockUser,
        admin: mockAdmin,
      };

      mockPrismaService.user.findUnique
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(mockAdmin);
      mockPrismaService.conversation.findFirst.mockResolvedValue(existingConv);

      const result = await service.create(1, 2, 'Test');

      expect(result).toEqual(existingConv);
      expect(mockPrismaService.conversation.create).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('devrait retourner une conversation par ID', async () => {
      const mockConversation = {
        id: 1,
        user_id: 1,
        admin_id: 2,
        status: ConversationStatus.Open,
        user: { id: 1, pseudo: 'user1' },
        admin: { id: 2, pseudo: 'admin1' },
        messages: [],
      };

      mockPrismaService.conversation.findUnique.mockResolvedValue(
        mockConversation,
      );

      const result = await service.findOne(1);

      expect(result).toEqual(mockConversation);
      expect(mockPrismaService.conversation.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: expect.any(Object),
      });
    });

    it('devrait lancer NotFoundException si conversation introuvable', async () => {
      mockPrismaService.conversation.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'Conversation non trouvée',
      );
    });
  });

  describe('findByUser', () => {
    it('devrait retourner les conversations d\'un USER', async () => {
      const mockConversations = [
        { id: 1, user_id: 1, admin_id: 2, status: ConversationStatus.Open },
      ];

      mockPrismaService.conversation.findMany.mockResolvedValue(
        mockConversations,
      );

      const result = await service.findByUser(1, 'USER');

      expect(result).toEqual(mockConversations);
      expect(mockPrismaService.conversation.findMany).toHaveBeenCalledWith({
        where: { user_id: 1 },
        include: expect.any(Object),
        orderBy: { updated_at: 'desc' },
      });
    });

    it('devrait retourner toutes les conversations OPEN pour un ADMIN', async () => {
      const mockConversations = [
        { id: 1, user_id: 1, admin_id: 2, status: ConversationStatus.Open },
        { id: 2, user_id: 3, admin_id: 2, status: ConversationStatus.Open },
      ];

      mockPrismaService.conversation.findMany.mockResolvedValue(
        mockConversations,
      );

      const result = await service.findByUser(2, 'ADMIN');

      expect(result).toEqual(mockConversations);
      expect(mockPrismaService.conversation.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { admin_id: 2 },
            { status: ConversationStatus.Open },
          ],
        },
        include: expect.any(Object),
        orderBy: { updated_at: 'desc' },
      });
    });
  });

  describe('userHasAccess', () => {
    it('devrait retourner true si utilisateur est participant', async () => {
      const mockConversation = { id: 1, user_id: 1, admin_id: 2 };

      mockPrismaService.conversation.findFirst.mockResolvedValue(
        mockConversation,
      );

      const result = await service.userHasAccess(1, 1);

      expect(result).toBe(true);
    });

    it('devrait retourner true si utilisateur est admin de la conversation', async () => {
      const mockConversation = { id: 1, user_id: 1, admin_id: 2 };

      mockPrismaService.conversation.findFirst.mockResolvedValue(
        mockConversation,
      );

      const result = await service.userHasAccess(2, 1);

      expect(result).toBe(true);
    });

    it('devrait retourner false si utilisateur n\'est pas participant', async () => {
      mockPrismaService.conversation.findFirst.mockResolvedValue(null);

      const result = await service.userHasAccess(999, 1);

      expect(result).toBe(false);
    });
  });

  describe('updateStatus', () => {
    it('devrait mettre à jour le statut de la conversation', async () => {
      const mockConversation = {
        id: 1,
        user_id: 1,
        admin_id: 2,
        status: ConversationStatus.Open,
        user: { id: 1, pseudo: 'user1' },
        admin: { id: 2, pseudo: 'admin1' },
        messages: [],
      };

      const mockUpdated = { ...mockConversation, status: ConversationStatus.Closed };

      mockPrismaService.conversation.findUnique.mockResolvedValue(
        mockConversation,
      );
      mockPrismaService.conversation.update.mockResolvedValue(mockUpdated);

      const result = await service.updateStatus(
        1,
        ConversationStatus.Closed,
        2,
      );

      expect(result.status).toBe(ConversationStatus.Closed);
      expect(mockPrismaService.conversation.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: ConversationStatus.Closed },
        include: expect.any(Object),
      });
    });

    it('devrait lancer ForbiddenException si admin pas propriétaire', async () => {
      const mockConversation = {
        id: 1,
        user_id: 1,
        admin_id: 2,
        user: { id: 1, pseudo: 'user1' },
        admin: { id: 2, pseudo: 'admin1' },
        messages: [],
      };

      mockPrismaService.conversation.findUnique.mockResolvedValue(
        mockConversation,
      );

      await expect(
        service.updateStatus(1, ConversationStatus.Closed, 3),
      ).rejects.toThrow(ForbiddenException);
      await expect(
        service.updateStatus(1, ConversationStatus.Closed, 3),
      ).rejects.toThrow('Vous n\'avez pas accès à cette conversation');
    });
  });

  describe('touch', () => {
    it('devrait mettre à jour le timestamp updated_at', async () => {
      mockPrismaService.conversation.update.mockResolvedValue({});

      await service.touch(1);

      expect(mockPrismaService.conversation.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { updated_at: expect.any(Date) },
      });
    });
  });
});
