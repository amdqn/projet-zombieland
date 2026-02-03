import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    validateUser: jest.fn(),
    generateJwt: jest.fn(),
    updateProfile: jest.fn(),
    deleteAccount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('devrait créer un nouvel utilisateur', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'Password123!',
        pseudo: 'testuser',
      };
      const mockUser = { id: 1, email: 'test@example.com', pseudo: 'testuser' };

      mockAuthService.register.mockResolvedValue(mockUser);

      const result = await controller.register(registerDto as any);

      expect(result).toEqual(mockUser);
      expect(service.register).toHaveBeenCalledWith(registerDto);
    });

    it('devrait créer un utilisateur avec tous les champs optionnels', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'Password123!',
        pseudo: 'testuser',
        first_name: 'John',
        last_name: 'Doe',
      };
      const mockUser = { id: 1, ...registerDto };

      mockAuthService.register.mockResolvedValue(mockUser);

      const result = await controller.register(registerDto as any);

      expect(result).toEqual(mockUser);
      expect(service.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('devrait authentifier un utilisateur et retourner un token', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        pseudo: 'testuser',
        role: 'USER',
      };
      const mockToken = 'jwt-token-123';

      mockAuthService.validateUser.mockResolvedValue(mockUser);
      mockAuthService.generateJwt.mockResolvedValue({
        access_token: mockToken,
      });

      const result = await controller.login(loginDto as any);

      expect(result).toEqual({
        user: mockUser,
        access_token: mockToken,
      });
      expect(service.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'Password123!',
      );
      expect(service.generateJwt).toHaveBeenCalledWith(mockUser);
    });

    it('devrait gérer un utilisateur ADMIN', async () => {
      const loginDto = {
        email: 'admin@example.com',
        password: 'Admin123!',
      };
      const mockAdmin = {
        id: 2,
        email: 'admin@example.com',
        pseudo: 'admin',
        role: 'ADMIN',
      };
      const mockToken = 'admin-jwt-token';

      mockAuthService.validateUser.mockResolvedValue(mockAdmin);
      mockAuthService.generateJwt.mockResolvedValue({
        access_token: mockToken,
      });

      const result = await controller.login(loginDto as any);

      expect(result).toEqual({
        user: mockAdmin,
        access_token: mockToken,
      });
    });
  });

  describe('getProfile', () => {
    it("devrait retourner le profil de l'utilisateur connecté", async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        pseudo: 'testuser',
        role: 'USER',
      };

      const result = await controller.getProfile(mockUser as any);

      expect(result).toEqual(mockUser);
    });

    it("devrait retourner le profil d'un ADMIN", async () => {
      const mockAdmin = {
        id: 2,
        email: 'admin@example.com',
        pseudo: 'admin',
        role: 'ADMIN',
      };

      const result = await controller.getProfile(mockAdmin as any);

      expect(result).toEqual(mockAdmin);
    });
  });

  describe('updateProfile', () => {
    it("devrait mettre à jour le profil de l'utilisateur", async () => {
      const mockUser = { id: 1, email: 'test@example.com', pseudo: 'testuser' };
      const updateDto = { pseudo: 'newtestuser', first_name: 'John' };
      const mockUpdated = { ...mockUser, ...updateDto };

      mockAuthService.updateProfile.mockResolvedValue(mockUpdated);

      const result = await controller.updateProfile(
        mockUser as any,
        updateDto as any,
      );

      expect(result).toEqual(mockUpdated);
      expect(service.updateProfile).toHaveBeenCalledWith(1, updateDto);
    });

    it('devrait mettre à jour uniquement le pseudo', async () => {
      const mockUser = { id: 1, email: 'test@example.com', pseudo: 'testuser' };
      const updateDto = { pseudo: 'newpseudo' };
      const mockUpdated = { ...mockUser, pseudo: 'newpseudo' };

      mockAuthService.updateProfile.mockResolvedValue(mockUpdated);

      const result = await controller.updateProfile(
        mockUser as any,
        updateDto as any,
      );

      expect(result).toEqual(mockUpdated);
      expect(service.updateProfile).toHaveBeenCalledWith(1, updateDto);
    });

    it('devrait mettre à jour plusieurs champs', async () => {
      const mockUser = { id: 1, email: 'test@example.com', pseudo: 'testuser' };
      const updateDto = {
        pseudo: 'newpseudo',
        first_name: 'John',
        last_name: 'Doe',
      };
      const mockUpdated = { ...mockUser, ...updateDto };

      mockAuthService.updateProfile.mockResolvedValue(mockUpdated);

      const result = await controller.updateProfile(
        mockUser as any,
        updateDto as any,
      );

      expect(result).toEqual(mockUpdated);
    });
  });

  describe('deleteAccount', () => {
    it("devrait supprimer le compte de l'utilisateur", async () => {
      const mockUser = { id: 1, email: 'test@example.com', pseudo: 'testuser' };
      const mockResponse = { message: 'Compte supprimé avec succès' };

      mockAuthService.deleteAccount.mockResolvedValue(mockResponse);

      const result = await controller.deleteAccount(mockUser as any);

      expect(result).toEqual(mockResponse);
      expect(service.deleteAccount).toHaveBeenCalledWith(1);
    });
  });
});
