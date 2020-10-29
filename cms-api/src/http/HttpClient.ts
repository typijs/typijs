import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import * as FormData from 'form-data';;

declare module 'axios' {
    interface AxiosResponse<T = any> extends Promise<T> { }
}

// TODO Should not abstract class. Should use same pattern as Angular HttpClient (with get, post, put, delete methods)
export abstract class HttpClient {
    protected readonly instance: AxiosInstance;

    public constructor(baseURL: string) {
        this.instance = axios.create({
            baseURL
        });

        this._initRequestInterceptor();
        this._initResponseInterceptor();
    }

    private _initRequestInterceptor = () => {
        this.instance.interceptors.request.use(
            this._handleRequest,
            this._handleError
        );
    };

    private _initResponseInterceptor = () => {
        this.instance.interceptors.response.use(
            this._handleResponse,
            this._handleError
        );
    };

    private _handleRequest = (config: AxiosRequestConfig) => {
        if (config.data instanceof FormData) {
            Object.assign(config.headers, config.data.getHeaders());
        }
        return config;
    };

    private _handleResponse = ({ data }: AxiosResponse) => data;

    private _handleError = (error: any) => Promise.reject(error);
}