import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { RegisterDto } from 'src/generated';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, pseudo, password, confirmPassword } = registerDto;

    // Validation des champs requis
    if (!email || !pseudo || !password || !confirmPassword) {
      throw new BadRequestException('Tous les champs sont requis');
    }

    // Validation de l'email (regex simple)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException("L'email n'est pas valide");
    }

    // Validation du pseudo (3-20 caractères)
    if (pseudo.length < 3 || pseudo.length > 20) {
      throw new BadRequestException(
        'Le pseudo doit contenir entre 3 et 20 caractères',
      );
    }

    // Validation du mot de passe
    // - Minimum 8 caractères
    // - Au moins une majuscule
    // - Au moins un chiffre
    if (password.length < 8) {
      throw new BadRequestException(
        'Le mot de passe doit contenir au moins 8 caractères',
      );
    }

    if (!/[A-Z]/.test(password)) {
      throw new BadRequestException(
        'Le mot de passe doit contenir au moins une majuscule',
      );
    }

    if (!/[0-9]/.test(password)) {
      throw new BadRequestException(
        'Le mot de passe doit contenir au moins un chiffre',
      );
    }

    // Validation: password et confirmPassword doivent correspondre
    if (password !== confirmPassword) {
      throw new BadRequestException(
        'Le mot de passe et la confirmation ne correspondent pas',
      );
    }

    const existingUserByEmail = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    const existingUserByPseudo = await this.prisma.user.findUnique({
      where: { pseudo },
    });

    if (existingUserByPseudo) {
      throw new ConflictException('Ce pseudo est déjà utilisé');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        pseudo,
        password: hashedPassword,
        role: 'CLIENT', // Role par défaut
      },
    });

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async validateUser(email: string, password: string) {
    // Validation des inputs
    if (!email || !password) {
      throw new BadRequestException('Email et password requis');
    }

    // Validation format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Email invalide');
    }

    // Validation longueur password
    if (password.length < 8) {
      throw new BadRequestException(
        'Le mot de passe doit contenir au moins 8 caractères',
      );
    }

    // Chercher l'utilisateur en DB
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Si user n'existe pas
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe invalide');
    }

    // Comparer les mots de passe avec bcrypt
    const passwordIsValid = await bcrypt.compare(password, user.password);

    // Si password invalide
    if (!passwordIsValid) {
      throw new UnauthorizedException('Email ou mot de passe invalide');
    }

    // Vérifier si le compte est actif
    if ((user as any).is_active === false) {
      throw new UnauthorizedException('Il semble y avoir un problème. Veuillez contacter l\'administrateur.');
    }

    // Retourner user SANS le password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async generateJwt(user: any) {
    // Créer le payload (données dans le token)
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const expiresIn = this.configService.get<number>('JWT_EXPIRATION') || 3600;
    const token = this.jwtService.sign(payload);

    // Retourner token + expiration
    return {
      access_token: token,
      expires_in: expiresIn,
    };
  }

  async updateProfile(
    userId: number,
    updateData: { email?: string; password?: string },
  ) {
    const { email, password } = updateData;

    // Validation des données
    if (email) {
      // Validation format email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new BadRequestException('Email invalide');
      }

      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new ConflictException('Cet email est déjà utilisé');
      }
    }

    if (password) {
      // Validation mot de passe
      if (password.length < 8) {
        throw new BadRequestException(
          'Le mot de passe doit contenir au moins 8 caractères',
        );
      }

      if (!/[A-Z]/.test(password)) {
        throw new BadRequestException(
          'Le mot de passe doit contenir au moins une majuscule',
        );
      }

      if (!/[0-9]/.test(password)) {
        throw new BadRequestException(
          'Le mot de passe doit contenir au moins un chiffre',
        );
      }
    }

    // Préparer les données à mettre à jour
    const dataToUpdate: any = {};
    if (email) dataToUpdate.email = email;
    if (password) dataToUpdate.password = await bcrypt.hash(password, 10);

    // Mettre à jour l'utilisateur
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    // Retourner sans le password
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async deleteAccount(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: { reservations: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} introuvable`);
    }

    // Vérifier s'il y a des réservations
    if (user._count.reservations > 0) {
      throw new BadRequestException(
        `Impossible de supprimer votre compte : ${user._count.reservations} réservation(s) associée(s). Veuillez d'abord annuler ou supprimer vos réservations.`,
      );
    }

    await this.prisma.user.delete({ where: { id: userId } });

    return {
      message: `Votre compte a été supprimé avec succès`,
    };
  }
}
