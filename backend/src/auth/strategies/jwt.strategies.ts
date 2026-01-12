import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      // 1. Comment extraire le token de la requête
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // 2. Rejeter si token expiré
      ignoreExpiration: false,

      // 3. Secret pour vérifier la signature (avec valeur par défaut)
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret',
    });
  }

  // Appelé automatiquement si le token est valide
  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    // Retourner user sans password (sera dans request.user)
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
