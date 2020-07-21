import { AxiosRequestConfig, AxiosResponse } from 'axios'
import * as FormData from 'form-data';;
import { HttpClient } from './HttpClient';

export type ImgurApiResponse = {
    data: {
        [key: string]: any | undefined;
    };
    success: boolean;
    status: number;
};

export type RefreshTokenResponse = {
    access_token: string;
    expires_in: number;
    token_type: 'bearer';
    scope: string;
    refresh_token: string;
    account_id: number;
    account_username: string;
};

export type UploadImageResponse = {
    id: string;
    title: string | null;
    description: string | null;
    datetime: number;
    type: string;
    animated: boolean;
    width: number;
    height: number;
    size: number;
    views: number;
    bandwidth: number;
    vote: any | null;
    favorite: boolean;
    nsfw: any | null;
    section: any | null;
    account_url: string | null;
    account_id: number;
    is_ad: boolean;
    in_most_viral: boolean;
    has_sound: boolean;
    tags: string[];
    ad_type: number;
    ad_url: string;
    edited: string;
    in_gallery: boolean;
    deletehash: string;
    name: string;
    link: string;
};

export type ImgurConfig = {
    baseUrl: string
    clientId: string
    clientSecret: string
    refreshToken: string
    accessToken: string
}

export class ImgurClient extends HttpClient {
    public constructor(private readonly config: ImgurConfig) {
        super(config.baseUrl);

        this._initRequestInterceptor();
    }

    public getAccessToken = (id: string): Promise<AxiosResponse<RefreshTokenResponse>> => {
        const data = new FormData();
        data.append('refresh_token', this.config.refreshToken);
        data.append('client_id', this.config.clientId);
        data.append('client_secret', this.config.clientSecret);
        data.append('grant_type', 'refresh_token');
        return this.instance.post<RefreshTokenResponse>(`/oauth2/token`, data)
    };

    public uploadImage = (imgBase64: string): Promise<AxiosResponse<UploadImageResponse>> => {
        const data = new FormData();
        data.append('image', imgBase64);
        return this.instance.post<UploadImageResponse>('/3/image', data);
    }

    public uploadVideo = (videoBase64: string): Promise<AxiosResponse<UploadImageResponse>> => {
        const data = new FormData();
        data.append('video', videoBase64);
        return this.instance.post<UploadImageResponse>('/3/image', data);
    }

    public deleteImage = (imageHash: string): Promise<AxiosResponse<ImgurApiResponse>> => this.instance.post<ImgurApiResponse>(`/3/image/${imageHash}`);

    private _initRequestInterceptor = () => {
        this.instance.interceptors.request.use(
            this._handleRequest,
            this._handleError,
        );
    };

    private _handleRequest = (config: AxiosRequestConfig) => {
        config.headers['Authorization'] = `Bearer ${this.config.accessToken}`;
        config.headers['Content-Type'] = `multipart/form-data`;
        return config;
    };
}

export const imgurClient = new ImgurClient({
    baseUrl: 'https://api.imgur.com',
    clientId: 'e9e87987fffa558',
    clientSecret: '2ad7eda7e3e0134f69e9a0ea44e456c3ba3fe563',
    refreshToken: '8cab8bd0b815cef6f224e031dcfaff4c49722c00',
    accessToken: '7e9f1e55c1c62af4bfc0a0933932cdb80391f4aa'
})