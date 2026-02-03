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
      count: jest.fn(),
      update: jest.fn(),
    },
    reservation: {
      findMany: jest.fn(),
    },
    userAuditLog: {
      findMany: jest.fn(),
      createMany: jest.fn(),
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
    it('devrait retourner tous les utilisateurs avec pagination', async () => {
      const mockUsers = [
        {
          id: 1,
          email: 'user1@test.com',
          pseudo: 'User1',
          password: 'hashedPassword1',
          role: Role.CLIENT,
          is_active: true,
          created_at: new Date('2025-01-01'),
          updated_at: new Date('2025-01-02'),
          _count: { reservations: 2 },
        },
        {
          id: 2,
          email: 'user2@test.com',
          pseudo: 'User2',
          password: 'hashedPassword2',
          role: Role.ADMIN,
          is_active: true,
          created_at: new Date('2025-01-03'),
          updated_at: new Date('2025-01-04'),
          _count: { reservations: 0 },
        },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(mockUsers);
      mockPrismaService.user.count.mockResolvedValue(2);

      const result = await service.findAll();

      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(result.data[0]).not.toHaveProperty('password');
      expect(result.data[1]).not.toHaveProperty('password');
      expect(result.data[0]).toEqual({
        id: 1,
        email: 'user1@test.com',
        pseudo: 'User1',
        role: Role.CLIENT,
        is_active: true,
        created_at: '2025-01-01T00:00:00.000Z',
        updated_at: '2025-01-02T00:00:00.000Z',
      });
      expect(mockPrismaService.user.findMany).toHaveBeenCalled();
      expect(mockPrismaService.user.count).toHaveBeenCalled();
    });

    it('devrait retourner un tableau vide si aucun utilisateur', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([]);
      mockPrismaService.user.count.mockResolvedValue(0);

      const result = await service.findAll();

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.user.count).toHaveBeenCalledTimes(1);
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
        is_active: true,
        created_at: new Date('2025-01-01'),
        updated_at: new Date('2025-01-02'),
        _count: { reservations: 3 },
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(result).not.toHaveProperty('password');
      expect(result).toEqual({
        id: 1,
        email: 'user@test.com',
        pseudo: 'TestUser',
        role: Role.CLIENT,
        is_active: true,
        created_at: '2025-01-01T00:00:00.000Z',
        updated_at: '2025-01-02T00:00:00.000Z',
      });
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          _count: {
            select: { reservations: true },
          },
        },
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

  describe('update', () => {
    beforeEach(() => {
      // Reset mock implementations to avoid test contamination
      mockPrismaService.user.findUnique.mockReset();
      mockPrismaService.user.update.mockReset();
      mockPrismaService.userAuditLog.createMany.mockReset();
    });

    it('devrait mettre à jour le pseudo et créer un audit log', async () => {
      const existingUser = {
        id: 1,
        email: 'user@test.com',
        pseudo: 'OldPseudo',
        password: 'hashedPassword',
        role: Role.CLIENT,
        is_active: true,
        created_at: new Date('2025-01-01'),
        updated_at: new Date('2025-01-02'),
      };

      const updatedUser = {
        ...existingUser,
        pseudo: 'NewPseudo',
        updated_at: new Date('2025-01-03'),
        _count: { reservations: 0 },
      };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      mockPrismaService.user.update.mockResolvedValue(updatedUser);
      mockPrismaService.userAuditLog.createMany.mockResolvedValue({ count: 1 });

      const result = await service.update(1, { pseudo: 'NewPseudo' }, 2);

      expect(result.pseudo).toBe('NewPseudo');
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { pseudo: 'NewPseudo' },
        include: {
          _count: {
            select: { reservations: true },
          },
        },
      });
      expect(mockPrismaService.userAuditLog.createMany).toHaveBeenCalledWith({
        data: [
          {
            user_id: 1,
            modified_by_id: 2,
            action: 'UPDATE',
            field_name: 'pseudo',
            old_value: JSON.stringify('OldPseudo'),
            new_value: JSON.stringify('NewPseudo'),
          },
        ],
      });
    });

    it('devrait mettre à jour is_active et créer un audit log ACTIVATE', async () => {
      const existingUser = {
        id: 1,
        email: 'user@test.com',
        pseudo: 'TestUser',
        password: 'hashedPassword',
        role: Role.CLIENT,
        is_active: false,
        created_at: new Date('2025-01-01'),
        updated_at: new Date('2025-01-02'),
      };

      const updatedUser = {
        ...existingUser,
        is_active: true,
        updated_at: new Date('2025-01-03'),
        _count: { reservations: 0 },
      };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      mockPrismaService.user.update.mockResolvedValue(updatedUser);
      mockPrismaService.userAuditLog.createMany.mockResolvedValue({ count: 1 });

      const result = await service.update(1, { is_active: true }, 2);

      expect(result.is_active).toBe(true);
      expect(mockPrismaService.userAuditLog.createMany).toHaveBeenCalledWith({
        data: [
          {
            user_id: 1,
            modified_by_id: 2,
            action: 'ACTIVATE',
            field_name: 'is_active',
            old_value: JSON.stringify(false),
            new_value: JSON.stringify(true),
          },
        ],
      });
    });

    it('devrait mettre à jour is_active et créer un audit log DEACTIVATE', async () => {
      const existingUser = {
        id: 1,
        email: 'user@test.com',
        pseudo: 'TestUser',
        password: 'hashedPassword',
        role: Role.CLIENT,
        is_active: true,
        created_at: new Date('2025-01-01'),
        updated_at: new Date('2025-01-02'),
      };

      const updatedUser = {
        ...existingUser,
        is_active: false,
        updated_at: new Date('2025-01-03'),
        _count: { reservations: 0 },
      };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      mockPrismaService.user.update.mockResolvedValue(updatedUser);
      mockPrismaService.userAuditLog.createMany.mockResolvedValue({ count: 1 });

      const result = await service.update(1, { is_active: false }, 2);

      expect(result.is_active).toBe(false);
      expect(mockPrismaService.userAuditLog.createMany).toHaveBeenCalledWith({
        data: [
          {
            user_id: 1,
            modified_by_id: 2,
            action: 'DEACTIVATE',
            field_name: 'is_active',
            old_value: JSON.stringify(true),
            new_value: JSON.stringify(false),
          },
        ],
      });
    });

    it('devrait mettre à jour plusieurs champs et créer plusieurs audit logs', async () => {
      const existingUser = {
        id: 1,
        email: 'old@test.com',
        pseudo: 'OldPseudo',
        password: 'hashedPassword',
        role: Role.CLIENT,
        is_active: true,
        created_at: new Date('2025-01-01'),
        updated_at: new Date('2025-01-02'),
      };

      const updatedUser = {
        ...existingUser,
        email: 'new@test.com',
        pseudo: 'NewPseudo',
        role: Role.ADMIN,
        updated_at: new Date('2025-01-03'),
        _count: { reservations: 0 },
      };

      mockPrismaService.user.findUnique
        .mockResolvedValueOnce(existingUser)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      mockPrismaService.user.update.mockResolvedValueOnce(updatedUser);
      mockPrismaService.userAuditLog.createMany.mockResolvedValueOnce({
        count: 3,
      });

      const result = await service.update(
        1,
        { pseudo: 'NewPseudo', email: 'new@test.com', role: 'ADMIN' },
        2,
      );

      expect(result.pseudo).toBe('NewPseudo');
      expect(result.email).toBe('new@test.com');
      expect(result.role).toBe('ADMIN');
      expect(mockPrismaService.userAuditLog.createMany).toHaveBeenCalledWith({
        data: expect.arrayContaining([
          expect.objectContaining({ field_name: 'pseudo', action: 'UPDATE' }),
          expect.objectContaining({ field_name: 'email', action: 'UPDATE' }),
          expect.objectContaining({ field_name: 'role', action: 'UPDATE' }),
        ]),
      });
    });

    it('devrait lancer NotFoundException si utilisateur non trouvé', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.update(999, { pseudo: 'NewPseudo' }, 2),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.update(999, { pseudo: 'NewPseudo' }, 2),
      ).rejects.toThrow("Utilisateur avec l'ID 999 introuvable");
      expect(mockPrismaService.user.update).not.toHaveBeenCalled();
    });

    it('devrait lancer BadRequestException si email déjà utilisé', async () => {
      const existingUser = {
        id: 1,
        email: 'user1@test.com',
        pseudo: 'User1',
        password: 'hashedPassword',
        role: Role.CLIENT,
        is_active: true,
        created_at: new Date('2025-01-01'),
        updated_at: new Date('2025-01-02'),
      };

      const conflictUser = {
        id: 2,
        email: 'user2@test.com',
        pseudo: 'User2',
        password: 'hashedPassword',
        role: Role.CLIENT,
        is_active: true,
        created_at: new Date('2025-01-01'),
        updated_at: new Date('2025-01-02'),
      };

      // First call: find user, second call: check email uniqueness
      mockPrismaService.user.findUnique
        .mockResolvedValueOnce(existingUser)
        .mockResolvedValueOnce(conflictUser);

      await expect(
        service.update(1, { email: 'user2@test.com' }, 2),
      ).rejects.toThrow('Cet email est déjà utilisé par un autre utilisateur');
      expect(mockPrismaService.user.update).not.toHaveBeenCalled();
    });

    it('devrait lancer BadRequestException si pseudo déjà utilisé', async () => {
      const existingUser = {
        id: 1,
        email: 'user1@test.com',
        pseudo: 'User1',
        password: 'hashedPassword',
        role: Role.CLIENT,
        is_active: true,
        created_at: new Date('2025-01-01'),
        updated_at: new Date('2025-01-02'),
      };

      const conflictUser = {
        id: 2,
        email: 'user2@test.com',
        pseudo: 'User2',
        password: 'hashedPassword',
        role: Role.CLIENT,
        is_active: true,
        created_at: new Date('2025-01-01'),
        updated_at: new Date('2025-01-02'),
      };

      // First call: find user, second call: check pseudo uniqueness (no email check since no email in updateData)
      mockPrismaService.user.findUnique
        .mockResolvedValueOnce(existingUser)
        .mockResolvedValueOnce(conflictUser);

      await expect(service.update(1, { pseudo: 'User2' }, 2)).rejects.toThrow(
        'Ce pseudo est déjà utilisé par un autre utilisateur',
      );
      expect(mockPrismaService.user.update).not.toHaveBeenCalled();
    });

    it("ne devrait pas créer d'audit log si aucun changement", async () => {
      const existingUser = {
        id: 1,
        email: 'user@test.com',
        pseudo: 'TestUser',
        password: 'hashedPassword',
        role: Role.CLIENT,
        is_active: true,
        created_at: new Date('2025-01-01'),
        updated_at: new Date('2025-01-02'),
        _count: { reservations: 0 },
      };

      // Only one call: find user (no uniqueness check since pseudo is same)
      mockPrismaService.user.findUnique.mockResolvedValueOnce(existingUser);
      mockPrismaService.user.update.mockResolvedValue(existingUser);

      const result = await service.update(1, { pseudo: 'TestUser' }, 2);

      expect(result.pseudo).toBe('TestUser');
      expect(mockPrismaService.userAuditLog.createMany).not.toHaveBeenCalled();
    });
  });

  describe('getUserAuditLogs', () => {
    it("devrait retourner les logs d'audit d'un utilisateur", async () => {
      const mockUser = {
        id: 1,
        email: 'user@test.com',
        pseudo: 'TestUser',
        password: 'hashedPassword',
        role: Role.CLIENT,
        is_active: true,
        created_at: new Date('2025-01-01'),
        updated_at: new Date('2025-01-02'),
      };

      const mockAuditLogs = [
        {
          id: 1,
          user_id: 1,
          modified_by_id: 2,
          action: 'UPDATE',
          field_name: 'pseudo',
          old_value: '"OldPseudo"',
          new_value: '"NewPseudo"',
          created_at: new Date('2025-01-03'),
          modified_by: {
            id: 2,
            pseudo: 'Admin',
            email: 'admin@test.com',
          },
        },
        {
          id: 2,
          user_id: 1,
          modified_by_id: 2,
          action: 'ACTIVATE',
          field_name: 'is_active',
          old_value: 'false',
          new_value: 'true',
          created_at: new Date('2025-01-04'),
          modified_by: {
            id: 2,
            pseudo: 'Admin',
            email: 'admin@test.com',
          },
        },
      ];

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.userAuditLog.findMany.mockResolvedValue(mockAuditLogs);

      const result = await service.getUserAuditLogs(1);

      expect(result).toEqual(mockAuditLogs);
      expect(result).toHaveLength(2);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrismaService.userAuditLog.findMany).toHaveBeenCalledWith({
        where: { user_id: 1 },
        orderBy: { created_at: 'desc' },
        include: {
          modified_by: {
            select: {
              id: true,
              pseudo: true,
              email: true,
            },
          },
        },
      });
    });

    it('devrait lancer NotFoundException si utilisateur non trouvé', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getUserAuditLogs(999)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getUserAuditLogs(999)).rejects.toThrow(
        "Utilisateur avec l'ID 999 introuvable",
      );
      expect(mockPrismaService.userAuditLog.findMany).not.toHaveBeenCalled();
    });

    it('devrait retourner un tableau vide si aucun log', async () => {
      const mockUser = {
        id: 1,
        email: 'user@test.com',
        pseudo: 'TestUser',
        password: 'hashedPassword',
        role: Role.CLIENT,
        is_active: true,
        created_at: new Date('2025-01-01'),
        updated_at: new Date('2025-01-02'),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.userAuditLog.findMany.mockResolvedValue([]);

      const result = await service.getUserAuditLogs(1);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });
});
