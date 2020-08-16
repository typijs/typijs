
import { HttpClient } from '@angular/common/http';
import { AppInjector } from '../utils/appInjector';
import { ConfigService } from '../config/config.service';

export abstract class BaseService {
    protected baseApiUrl: string = AppInjector ? AppInjector.get(ConfigService).baseApiUrl : '';
    protected httpClient: HttpClient;
    protected abstract apiUrl: string;
    constructor(httpClient: HttpClient) {
        this.httpClient = httpClient;
    }
}