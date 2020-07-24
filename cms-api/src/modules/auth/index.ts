import { Provider } from 'injection-js';
import { AuthController } from './auth.controller';
import { AuthRouter } from './auth.route';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

const AuthProviders: Provider[] = [TokenService, AuthService, AuthRouter, AuthController]
export { TokenService, AuthService, AuthRouter, AuthController, AuthProviders };
