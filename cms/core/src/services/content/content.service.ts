import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Content } from './models/content.model';
import { FolderService } from './folder.service';
import { convertObjectToUrlQueryString } from '../../helpers/common';

export abstract class ContentService<T extends Content> extends FolderService<T> {

    constructor(httpClient: HttpClient) {
        super(httpClient);
    }

    /**
     * Creates content based on language
     * @param content
     * @param language Optional, if it is not provided, the default language will be used
     * @returns content
     */
    createContent(content: Partial<T>, language?: string): Observable<T> {
        const query = convertObjectToUrlQueryString({ language });
        return this.httpClient.post<T>(`${this.apiUrl}?${query}`, content);
    }

    getSimpleContent(contentId: string, language?: string): Observable<T> {
        const query = convertObjectToUrlQueryString({ language });
        return this.httpClient.get<T>(`${this.apiUrl}/simple/${contentId}?${query}`);
    }

    getContentChildren(parentId: string): Observable<T[]> {
        return this.httpClient.get<T[]>(`${this.apiUrl}/children/${parentId}`);
    }

    moveContentToTrash(contentId: string): Observable<T> {
        return this.httpClient.put<T>(`${this.apiUrl}/trash/${contentId}`, {});
    }

    deleteContent(contentId: string): Observable<T> {
        return this.httpClient.delete<T>(`${this.apiUrl}/trash/${contentId}`);
    }

    cutContent(actionParams: { sourceContentId: string, targetParentId: string }): Observable<T> {
        return this.httpClient.post<T>(`${this.apiUrl}/cut`, actionParams);
    }

    copyContent(actionParams: { sourceContentId: string, targetParentId: string }): Observable<T> {
        return this.httpClient.post<T>(`${this.apiUrl}/copy`, actionParams);
    }

    /*------------------------------------Version-------------------------------------*/

    /**
     * Edit content version
     * @param contentId
     * @param versionId
     * @param content
     */
    editContentVersion(contentId: string, versionId: string, content: Partial<T>): Observable<T> {
        return this.httpClient.put<T>(`${this.apiUrl}/version/${contentId}?versionId=${versionId}`, content);
    }

    /**
     * Publishs convent version
     * @param contentId
     * @param versionId
     * @returns content
     */
    publishContentVersion(contentId: string, versionId: string): Observable<T> {
        return this.httpClient.put<T>(`${this.apiUrl}/version/publish/${contentId}?versionId=${versionId}`, {});
    }

    /**
     * Get content version detail
     * @param contentId
     * @param versionId
     * @param language
     * @param host
     */
    getContentVersion(contentId: string, versionId: string, language?: string, host?: string): Observable<T> {
        const query = convertObjectToUrlQueryString({ versionId, language, host });
        return this.httpClient.get<T>(`${this.apiUrl}/version/${contentId}?${query}`);
    }

    getContentVersions(contentId: string): Observable<T[]> {
        return this.httpClient.get<T[]>(`${this.apiUrl}/version/list/${contentId}`);
    }

    setPrimaryVersion(versionId: string): Observable<T> {
        return this.httpClient.put<T>(`${this.apiUrl}/version/set-primary/${versionId}`, {});
    }
}
