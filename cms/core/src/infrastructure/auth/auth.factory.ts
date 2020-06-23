import { AuthenticationService } from './authentication.service';
import { ConfigService } from '../config/config.service';

export function authCheckFactory(authenticationService: AuthenticationService, configService: ConfigService): () => Promise<void> {
    return () => new Promise((resolve, reject) => {
        // attempt to refresh token on app start up to auto authenticate
        authenticationService.setBaseApiUrl(configService.baseApiUrl).refreshToken()
            .subscribe()
            .add(resolve);
    });
}