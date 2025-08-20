import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  AuthenticateRequest,
  AuthServiceController,
  AuthServiceControllerMethods,
  User,
} from '@workhub/grpc';
import { GrpcLoggingInterceptor } from '@workhub/grpc';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { UserService } from '../users/user.service';
import { TokenPayload } from './token-payload.interface';

@Controller()
@AuthServiceControllerMethods()
@UseInterceptors(GrpcLoggingInterceptor)
export class AuthController implements AuthServiceController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(JwtAuthGuard)
  authentication(
    request: AuthenticateRequest & { user: TokenPayload }
  ): Promise<User> | Observable<User> | User {
    console.log(request);
    return this.userService.getUser({ id: request.user.userId });
  }
}
