import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt');

describe('AuthService - Register', () => {
  let service: AuthService;
  let _prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('devrait être défini', () => {
    expect(service).toBeDefined();
  });

  describe('Validation des champs requis', () => {
    it("devrait rejeter si l'email est manquant", async () => {
      const registerDto = {
        email: '',
        pseudo: 'TestUser',
        password: 'Password123',
        confirmPassword: 'Password123',
      };

      await expect(service.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.register(registerDto)).rejects.toThrow(
        'Tous les champs sont requis',
      );
    });

    it('devrait rejeter si le pseudo est manquant', async () => {
      const registerDto = {
        email: 'test@example.com',
        pseudo: '',
        password: 'Password123',
        confirmPassword: 'Password123',
      };

      await expect(service.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('devrait rejeter si le password est manquant', async () => {
      const registerDto = {
        email: 'test@example.com',
        pseudo: 'TestUser',
        password: '',
        confirmPassword: 'Password123',
      };

      await expect(service.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe("Validation de l'email", () => {
    it('devrait rejeter un email invalide', async () => {
      const registerDto = {
        email: 'invalid-email',
        pseudo: 'TestUser',
        password: 'Password123',
        confirmPassword: 'Password123',
      };

      await expect(service.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.register(registerDto)).rejects.toThrow(
        "L'email n'est pas valide",
      );
    });

    it('devrait accepter un email valide', async () => {
      const registerDto = {
        email: 'valid@example.com',
        pseudo: 'TestUser',
        password: 'Password123',
        confirmPassword: 'Password123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: 1,
        email: registerDto.email,
        pseudo: registerDto.pseudo,
        password: 'hashedPassword',
        role: 'CLIENT',
        created_at: new Date(),
        updated_at: new Date(),
      });
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      await expect(service.register(registerDto)).resolves.toBeDefined();
    });
  });

  describe('Validation du pseudo', () => {
    it('devrait rejeter un pseudo trop court (< 3 caractères)', async () => {
      const registerDto = {
        email: 'test@example.com',
        pseudo: 'ab',
        password: 'Password123',
        confirmPassword: 'Password123',
      };

      await expect(service.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.register(registerDto)).rejects.toThrow(
        'Le pseudo doit contenir entre 3 et 20 caractères',
      );
    });

    it('devrait rejeter un pseudo trop long (> 20 caractères)', async () => {
      const registerDto = {
        email: 'test@example.com',
        pseudo: 'a'.repeat(21),
        password: 'Password123',
        confirmPassword: 'Password123',
      };

      await expect(service.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.register(registerDto)).rejects.toThrow(
        'Le pseudo doit contenir entre 3 et 20 caractères',
      );
    });

    it('devrait accepter un pseudo valide (3-20 caractères)', async () => {
      const registerDto = {
        email: 'test@example.com',
        pseudo: 'ValidPseudo',
        password: 'Password123',
        confirmPassword: 'Password123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: 1,
        email: registerDto.email,
        pseudo: registerDto.pseudo,
        password: 'hashedPassword',
        role: 'CLIENT',
        created_at: new Date(),
        updated_at: new Date(),
      });
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      await expect(service.register(registerDto)).resolves.toBeDefined();
    });
  });

  describe('Validation du mot de passe', () => {
    it('devrait rejeter un mot de passe trop court (< 8 caractères)', async () => {
      const registerDto = {
        email: 'test@example.com',
        pseudo: 'TestUser',
        password: 'Pass1',
        confirmPassword: 'Pass1',
      };

      await expect(service.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.register(registerDto)).rejects.toThrow(
        'Le mot de passe doit contenir au moins 8 caractères',
      );
    });

    it('devrait rejeter un mot de passe sans majuscule', async () => {
      const registerDto = {
        email: 'test@example.com',
        pseudo: 'TestUser',
        password: 'password123',
        confirmPassword: 'password123',
      };

      await expect(service.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.register(registerDto)).rejects.toThrow(
        'Le mot de passe doit contenir au moins une majuscule',
      );
    });

    it('devrait rejeter un mot de passe sans chiffre', async () => {
      const registerDto = {
        email: 'test@example.com',
        pseudo: 'TestUser',
        password: 'Password',
        confirmPassword: 'Password',
      };

      await expect(service.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.register(registerDto)).rejects.toThrow(
        'Le mot de passe doit contenir au moins un chiffre',
      );
    });

    it('devrait accepter un mot de passe valide (8+ caractères, majuscule, chiffre)', async () => {
      const registerDto = {
        email: 'test@example.com',
        pseudo: 'TestUser',
        password: 'Password123',
        confirmPassword: 'Password123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: 1,
        email: registerDto.email,
        pseudo: registerDto.pseudo,
        password: 'hashedPassword',
        role: 'CLIENT',
        created_at: new Date(),
        updated_at: new Date(),
      });
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      await expect(service.register(registerDto)).resolves.toBeDefined();
    });

    it('devrait rejeter si password et confirmPassword ne correspondent pas', async () => {
      const registerDto = {
        email: 'test@example.com',
        pseudo: 'TestUser',
        password: 'Password123',
        confirmPassword: 'DifferentPassword123',
      };

      await expect(service.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.register(registerDto)).rejects.toThrow(
        'Le mot de passe et la confirmation ne correspondent pas',
      );
    });
  });

  describe("Vérification d'unicité", () => {
    it("devrait rejeter si l'email existe déjà", async () => {
      const registerDto = {
        email: 'existing@example.com',
        pseudo: 'TestUser',
        password: 'Password123',
        confirmPassword: 'Password123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'existing@example.com',
        pseudo: 'ExistingUser',
        password: 'hashedPassword',
        role: 'CLIENT',
        created_at: new Date(),
        updated_at: new Date(),
      });

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.register(registerDto)).rejects.toThrow(
        'Cet email est déjà utilisé',
      );
    });

    it('devrait rejeter si le pseudo existe déjà', async () => {
      const registerDto = {
        email: 'test@example.com',
        pseudo: 'ExistingUser',
        password: 'Password123',
        confirmPassword: 'Password123',
      };

      // Mock avec implémentation personnalisée pour différencier les appels
      mockPrismaService.user.findUnique.mockImplementation((args) => {
        if (args.where.email) {
          // Vérification email : pas trouvé
          return Promise.resolve(null);
        } else if (args.where.pseudo) {
          // Vérification pseudo : trouvé
          return Promise.resolve({
            id: 2,
            email: 'other@example.com',
            pseudo: 'ExistingUser',
            password: 'hashedPassword',
            role: 'CLIENT',
            created_at: new Date(),
            updated_at: new Date(),
          });
        }
        return Promise.resolve(null);
      });

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.register(registerDto)).rejects.toThrow(
        'Ce pseudo est déjà utilisé',
      );
    });
  });

  describe("Création d'utilisateur réussie", () => {
    it('devrait hash le mot de passe avec bcrypt', async () => {
      const registerDto = {
        email: 'test@example.com',
        pseudo: 'TestUser',
        password: 'Password123',
        confirmPassword: 'Password123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: 1,
        email: registerDto.email,
        pseudo: registerDto.pseudo,
        password: 'hashedPassword',
        role: 'CLIENT',
        created_at: new Date(),
        updated_at: new Date(),
      });
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      await service.register(registerDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('Password123', 10);
    });

    it("devrait créer l'utilisateur avec le role CLIENT par défaut", async () => {
      const registerDto = {
        email: 'test@example.com',
        pseudo: 'TestUser',
        password: 'Password123',
        confirmPassword: 'Password123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: 1,
        email: registerDto.email,
        pseudo: registerDto.pseudo,
        password: 'hashedPassword',
        role: 'CLIENT',
        created_at: new Date(),
        updated_at: new Date(),
      });
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      await service.register(registerDto);

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          pseudo: 'TestUser',
          password: 'hashedPassword',
          role: 'CLIENT',
        },
      });
    });

    it("devrait retourner l'utilisateur sans le mot de passe", async () => {
      const registerDto = {
        email: 'test@example.com',
        pseudo: 'TestUser',
        password: 'Password123',
        confirmPassword: 'Password123',
      };

      const createdUser = {
        id: 1,
        email: 'test@example.com',
        pseudo: 'TestUser',
        password: 'hashedPassword',
        role: 'CLIENT',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(createdUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const result = await service.register(registerDto);

      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('pseudo');
      expect(result).toHaveProperty('role');
      expect(result.email).toBe('test@example.com');
      expect(result.pseudo).toBe('TestUser');
      expect(result.role).toBe('CLIENT');
    });
  });
});
