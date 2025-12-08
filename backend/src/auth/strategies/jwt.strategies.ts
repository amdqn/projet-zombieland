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
    // payload = { sub: 5, email: "test@zombieland.com", role: "CLIENT", iat: 1733..., exp: 1733... }
    
    // Récupérer l'utilisateur depuis la DB avec l'ID (payload.sub)
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    // Si l'utilisateur n'existe plus (supprimé entre-temps)
    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    // Retourner user sans password (sera dans request.user)
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}