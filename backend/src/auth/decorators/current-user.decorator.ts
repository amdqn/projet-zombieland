import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // Récupérer la requête HTTP
    const request = ctx.switchToHttp().getRequest();
    
    // Retourner request.user (injecté par JwtStrategy)
    return request.user;
  },
);
