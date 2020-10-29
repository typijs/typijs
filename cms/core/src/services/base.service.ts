
import { HttpClient } from '@angular/common/http';
import { AppInjector } from '../utils/app-injector';
import { ConfigService } from '../config/config.service';

// TODO can be refactored as the article by using the inject function
// https://medium.com/its-tinkoff/features-of-angular-di-about-which-almost-nothing-is-said-in-the-documentation-45ef8485742a
export abstract class BaseService {
    protected baseApiUrl: string = AppInjector ? AppInjector.get(ConfigService).baseApiUrl : '';
    protected httpClient: HttpClient;
    protected abstract apiUrl: string;
    constructor(httpClient: HttpClient) {
        this.httpClient = httpClient;
    }
}
