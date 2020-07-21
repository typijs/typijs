import { Provider, ReflectiveInjector, ResolvedReflectiveProvider } from 'injection-js';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { AuthController } from './auth.controller';
import { AuthRouter } from './auth.route';

const AuthProviders: Provider[] = [AuthService, TokenService, AuthController, AuthRouter]
export const ResolveAuthProviders: ResolvedReflectiveProvider[] = ReflectiveInjector.resolve(AuthProviders);