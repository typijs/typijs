import { Provider } from 'injection-js';
import { HttpClient } from './HttpClient';
import { ImgurClient } from './ImgurClient';

const HttpClientProviders: Provider[] = [ImgurClient]
export { HttpClientProviders, ImgurClient, HttpClient }