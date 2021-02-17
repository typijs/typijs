import { Provider } from 'injection-js';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.middleware';
import { AuthRouter } from './auth.route';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

export * from './auth.decorator';
export { TokenService, AuthService, AuthRouter, AuthController, AuthGuard };
export const AuthProviders: Provider[] = [TokenService, AuthService, AuthRouter, AuthController, AuthGuard]
