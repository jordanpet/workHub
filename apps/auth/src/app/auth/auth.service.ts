import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginInput } from './dtos/login.input';
import { UserService } from '../users/user.service';
import { compare } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './token-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}
  async login({ email, password }: LoginInput, response: Response) {
    const user = await this.verifyUser(email, password);
    const expirationMs = parseInt(
      this.configService.getOrThrow('JWT_EXPIRATION_MS'),
      10
    );
    const expires = new Date(Date.now() + expirationMs);
    const tokenPayload: TokenPayload = {
      userId: user.id,
    };
    const accessToken = this.jwtService.sign(tokenPayload);
    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      //secure: this.configService.get('NODE_ENV') === 'production',
      secure: this.configService.get('SECURE_COOKIE'),
      expires,
    });
    return user;
  }
  private async verifyUser(email: string, password: string) {
    try {
      const user = await this.userService.getUser({
        email,
      });
      const authentication = await compare(password, user.password);
      if (!authentication) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException(
        'the credential you provided is not valid'
      );
    }
  }
}
