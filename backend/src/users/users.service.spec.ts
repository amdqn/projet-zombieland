import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Role } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;
  let _prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    reservation: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    _prismaService = module.get<PrismaService>(PrismaService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('devrait être défini', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('devrait retourner tous les utilisateurs sans les mots de passe', async () => {
      const mockUsers = [
        {
          id: 1,
          email: 'user1@test.com',
          pseudo: 'User1',
          password: 'hashedPassword1',
          role: Role.CLIENT,
          created_at: new Date('2025-01-01'),
          updated_at: new Date('2025-01-02'),
        },
        {
          id: 2,
          email: 'user2@test.com',
          pseudo: 'User2',
          password: 'hashedPassword2',
          role: Role.ADMIN,
          created_at: new Date('2025-01-03'),
          updated_at: new Date('2025-01-04'),
        },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).not.toHaveProperty('password');
      expect(result[1]).not.toHaveProperty('password');
      expect(result[0]).toEqual({
        id: 1,
        email: 'user1@test.com',
        pseudo: 'User1',
        role: Role.CLIENT,
        created_at: '2025-01-01T00:00:00.000Z',
        updated_at: '2025-01-02T00:00:00.000Z',
      });
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        orderBy: { created_at: 'desc' },
      });
    });

    it('devrait retourner un tableau vide si aucun utilisateur', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('devrait retourner un utilisateur par ID sans le mot de passe', async () => {
      const mockUser = {
        id: 1,
        email: 'user@test.com',
        pseudo: 'TestUser',
        password: 'hashedPassword',
        role: Role.CLIENT,
        created_at: new Date('2025-01-01'),
        updated_at: new Date('2025-01-02'),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(result).not.toHaveProperty('password');
      expect(result).toEqual({
        id: 1,
        email: 'user@test.com',
        pseudo: 'TestUser',
        role: Role.CLIENT,
        created_at: '2025-01-01T00:00:00.000Z',
        updated_at: '2025-01-02T00:00:00.000Z',
      });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('devrait lancer NotFoundException si utilisateur non trouvé', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        "Utilisateur avec l'ID 999 introuvable",
      );
    });
  });

  describe('findUserReservations', () => {
    it("devrait retourner les réservations d'un utilisateur", async () => {
      const mockUser = {
        id: 1,
        email: 'user@test.com',
        pseudo: 'TestUser',
        password: 'hashedPassword',
        role: Role.CLIENT,
        created_at: new Date('2025-01-01'),
        updated_at: new Date('2025-01-02'),
      };

      const mockReservations = [
        {
          id: 1,
          reservation_number: 'RES-001',
          user_id: 1,
          date_id: 1,
          tickets: {},
          total_amount: 50.0,
          status: 'CONFIRMED',
          created_at: new Date('2025-01-05'),
          updated_at: new Date('2025-01-05'),
          date: {
            id: 1,
            jour: new Date('2025-12-25'),
            is_open: true,
            notes: null,
            created_at: new Date('2025-01-01'),
          },
        },
      ];

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.reservation.findMany.mockResolvedValue(
        mockReservations,
      );

      const result = await service.findUserReservations(1);

      expect(result).toEqual(mockReservations);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrismaService.reservation.findMany).toHaveBeenCalledWith({
        where: { user_id: 1 },
        include: { date: true },
        orderBy: { created_at: 'desc' },
      });
    });

    it('devrait lancer NotFoundException si utilisateur non trouvé', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findUserReservations(999)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findUserReservations(999)).rejects.toThrow(
        "Utilisateur avec l'ID 999 introuvable",
      );
    });
  });

  describe('remove', () => {
    it('devrait supprimer un utilisateur sans réservations', async () => {
      const mockUser = {
        id: 1,
        email: 'user@test.com',
        pseudo: 'TestUser',
        password: 'hashedPassword',
        role: Role.CLIENT,
        created_at: new Date('2025-01-01'),
        updated_at: new Date('2025-01-02'),
        _count: {
          reservations: 0,
        },
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.delete.mockResolvedValue(mockUser);

      const result = await service.remove(1);

      expect(result).toEqual({
        message: 'Utilisateur TestUser supprimé avec succès',
      });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          _count: {
            select: { reservations: true },
          },
        },
      });
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('devrait lancer NotFoundException si utilisateur non trouvé', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      await expect(service.remove(999)).rejects.toThrow(
        "Utilisateur avec l'ID 999 introuvable",
      );
      expect(mockPrismaService.user.delete).not.toHaveBeenCalled();
    });

    it('devrait lancer BadRequestException si utilisateur a des réservations', async () => {
      const mockUser = {
        id: 1,
        email: 'user@test.com',
        pseudo: 'TestUser',
        password: 'hashedPassword',
        role: Role.CLIENT,
        created_at: new Date('2025-01-01'),
        updated_at: new Date('2025-01-02'),
        _count: {
          reservations: 3,
        },
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.remove(1)).rejects.toThrow(BadRequestException);
      await expect(service.remove(1)).rejects.toThrow(
        'Impossible de supprimer cet utilisateur : 3 réservation(s) associée(s)',
      );
      expect(mockPrismaService.user.delete).not.toHaveBeenCalled();
    });
  });
});
