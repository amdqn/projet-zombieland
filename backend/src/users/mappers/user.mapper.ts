import { User } from '@prisma/client';
import { UserDto } from '../../generated/model/userDto';

/**
 * Mapper User : Entité Prisma → DTO OpenAPI
 *
 * ⚠️ CRITIQUE : Ne JAMAIS exposer le mot de passe !
 *
 * Ce mapper garantit que seuls les champs autorisés
 * sont retournés à l'API, protégeant ainsi les données sensibles.
 */
export class UserMapper {
  /**
   * Transforme un User Prisma en DTO sécurisé
   *
   * @param user - Entité User de Prisma
   * @returns UserDto sans le password
   */
  static toDto(user: User): UserDto {
    return {
      id: user.id,
      email: user.email,
      pseudo: user.pseudo,
      role: user.role,
      is_active: user.is_active,
      created_at: user.created_at.toISOString(),
      updated_at: user.updated_at.toISOString(),
      // ⚠️ Le champ 'password' est VOLONTAIREMENT EXCLU
      // Ne jamais l'exposer via l'API
    };
  }

  /**
   * Transforme une liste d'utilisateurs
   *
   * @param users - Tableau d'entités User
   * @returns Tableau de UserDto sans passwords
   */
  static toDtoArray(users: User[]): UserDto[] {
    return users.map((user) => this.toDto(user));
  }

  /**
   * Pour les réponses d'authentification
   * Retourne l'utilisateur + le token JWT
   *
   * @param user - Entité User de Prisma
   * @param token - Token JWT généré
   * @returns Objet avec user (sans password) et access_token
   */
  static toAuthResponse(user: User, token: string) {
    return {
      user: this.toDto(user),
      access_token: token,
    };
  }
}
