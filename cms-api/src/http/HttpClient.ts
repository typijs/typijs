import axios, { AxiosInstance, AxiosResponse } from 'axios';

// declare module 'axios' {
//     interface AxiosResponse<T = any> extends Promise<T> { }
// }

export abstract class HttpClient {
    protected readonly instance: AxiosInstance;

    public constructor(baseURL: string) {
        this.instance = axios.create({
            baseURL,
        });

        this._initResponseInterceptor();
    }

    private _initResponseInterceptor = () => {
        this.instance.interceptors.response.use(
            //this._handleResponse,
            this._handleError,
        );
    };

    //private _handleResponse = ({ data }: AxiosResponse) => data;

    protected _handleError = (error: any) => Promise.reject(error);
}