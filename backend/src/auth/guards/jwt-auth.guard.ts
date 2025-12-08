import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // AuthGuard('jwt') :
  // - 'jwt' = nom de la stratégie (auto-détecté par Passport dans JwtStrategy)
  // - Appelle automatiquement JwtStrategy.validate() si token valide
  // - Retourne 401 si token manquant/invalide/expiré
  // - Injecte request.user si succès
  
  // Pas besoin de code supplémentaire ici !
  // Tout est géré par Passport automatiquement
}
