import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategies';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let prismaService: PrismaService;

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-secret'),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    prismaService = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('devrait retourner un utilisateur sans le password', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed_password',
        pseudo: 'testuser',
        role: 'USER',
        is_active: true,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const payload = { sub: 1, email: 'test@example.com' };
      const result = await strategy.validate(payload);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.email).toBe('test@example.com');
      expect(result.pseudo).toBe('testuser');
      expect((result as any).password).toBeUndefined();
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('devrait valider un utilisateur ADMIN', async () => {
      const mockAdmin = {
        id: 2,
        email: 'admin@example.com',
        password: 'hashed_password',
        pseudo: 'admin',
        role: 'ADMIN',
        is_active: true,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockAdmin);

      const payload = { sub: 2, email: 'admin@example.com' };
      const result = await strategy.validate(payload);

      expect(result.role).toBe('ADMIN');
      expect((result as any).password).toBeUndefined();
    });

    it('devrait lancer UnauthorizedException si utilisateur introuvable', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const payload = { sub: 999, email: 'unknown@example.com' };

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(strategy.validate(payload)).rejects.toThrow(
        'Utilisateur introuvable',
      );
    });

    it('devrait lancer UnauthorizedException si compte inactif', async () => {
      const mockInactiveUser = {
        id: 3,
        email: 'inactive@example.com',
        password: 'hashed_password',
        pseudo: 'inactive',
        role: 'USER',
        is_active: false,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockInactiveUser);

      const payload = { sub: 3, email: 'inactive@example.com' };

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(strategy.validate(payload)).rejects.toThrow(
        'Il semble y avoir un problème',
      );
    });

    it('devrait gérer un utilisateur sans is_active défini', async () => {
      const mockUser = {
        id: 4,
        email: 'noactive@example.com',
        password: 'hashed_password',
        pseudo: 'noactive',
        role: 'USER',
        // is_active non défini
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const payload = { sub: 4, email: 'noactive@example.com' };
      const result = await strategy.validate(payload);

      expect(result).toBeDefined();
      expect(result.id).toBe(4);
    });
  });
});
