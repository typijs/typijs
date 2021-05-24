import { AxiosRequestConfig } from 'axios';
import * as FormData from 'form-data';
import { ConfigManager, ImgurConfig } from '../config';
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

export type UploadResponse = ImgurApiResponse & {
    data: {
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
    }
};

export class ImgurClient extends HttpClient {
    private readonly imgurConfig: ImgurConfig = ConfigManager.getConfig().imgur;
    public constructor() {
        super(ConfigManager.getConfig().imgur.baseUrl);
        this.initAuthorizationRequestInterceptor();
    }

    public getAccessToken = (): Promise<RefreshTokenResponse> => {
        const data = new FormData();
        data.append('refresh_token', this.imgurConfig.refreshToken);
        data.append('client_id', this.imgurConfig.clientId);
        data.append('client_secret', this.imgurConfig.clientSecret);
        data.append('grant_type', 'refresh_token');
        return this.instance.post(`/oauth2/token`, data)
    };

    public uploadImage = (imgBase64: string): Promise<UploadResponse> => {
        const data = new FormData();
        data.append('image', imgBase64);
        return this.instance.post('/3/image', data);
    }

    public uploadVideo = (videoBase64: string): Promise<UploadResponse> => {
        const data = new FormData();
        data.append('video', videoBase64);
        return this.instance.post('/3/image', data);
    }

    public delete = (imageHash: string): Promise<ImgurApiResponse> => this.instance.post(`/3/image/${imageHash}`);

    private initAuthorizationRequestInterceptor = () => {
        this.instance.interceptors.request.use(
            (config: AxiosRequestConfig) => {
                if (this.imgurConfig.accessToken) config.headers['Authorization'] = `Bearer ${this.imgurConfig.accessToken}`;
                return config;
            },
            undefined
        );
    };
}