import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  const createMockExecutionContext = (user: any): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;
  };

  describe('canActivate', () => {
    it('devrait autoriser si aucun rôle requis', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

      const mockContext = createMockExecutionContext({ role: 'USER' });
      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('devrait autoriser si utilisateur a le rôle ADMIN requis', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);

      const mockUser = { id: 1, email: 'admin@test.com', role: 'ADMIN' };
      const mockContext = createMockExecutionContext(mockUser);
      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('devrait autoriser si utilisateur a le rôle USER requis', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['USER']);

      const mockUser = { id: 2, email: 'user@test.com', role: 'USER' };
      const mockContext = createMockExecutionContext(mockUser);
      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it("devrait refuser si utilisateur n'a pas le rôle requis", () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['ADMIN']);

      const mockUser = { id: 3, email: 'user@test.com', role: 'USER' };
      const mockContext = createMockExecutionContext(mockUser);
      const result = guard.canActivate(mockContext);

      expect(result).toBe(false);
    });

    it('devrait autoriser si utilisateur a un des rôles requis (multiple)', () => {
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue(['ADMIN', 'USER']);

      const mockUser = { id: 4, email: 'user@test.com', role: 'USER' };
      const mockContext = createMockExecutionContext(mockUser);
      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('devrait autoriser ADMIN quand ADMIN ou USER sont acceptés', () => {
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue(['ADMIN', 'USER']);

      const mockAdmin = { id: 5, email: 'admin@test.com', role: 'ADMIN' };
      const mockContext = createMockExecutionContext(mockAdmin);
      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
    });
  });
});
