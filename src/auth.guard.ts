import { ConfigEnum } from 'src/config/config.enum';
import { ConfigService } from "@nestjs/config";
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Reflector } from "@nestjs/core";
import { isJWT } from 'class-validator';
@Injectable()
export class AuthGuard implements CanActivate {
  @Inject()
  private jwtService: JwtService;

  @Inject()
  private configService: ConfigService;

  @Inject()
  private reflector: Reflector;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const publicApi = this.reflector.getAllAndOverride("public-api", [
      context.getClass(),
      context.getHandler(),
    ]);

    if (publicApi) {
      return true;
    }

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    if(!isJWT(token)){
      throw new BadRequestException("token发生了篡改");
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get(ConfigEnum.JWT_SECRET),
      });

      request["user"] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
