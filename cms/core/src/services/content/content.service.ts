import { Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BrowserLocationService } from '../../browser/browser-location.service';
import { convertObjectToUrlQueryString } from '../../helpers/common';
import { TypeOfContent } from '../../types';
import { FolderService } from './folder.service';
import { Content } from './models/content.model';

export abstract class ContentService<T extends Content> extends FolderService<T> {

    protected locationService: BrowserLocationService
    protected typeOfContent: TypeOfContent;
    constructor(injector: Injector) {
        super(injector);
        this.locationService = injector.get(BrowserLocationService);
    }
    abstract isMatching(typeOfContent: TypeOfContent);
    abstract getContentData(content: T);

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

    /**
     * Get the content detail without populate child items
     * @param contentId
     * @param language
     */
    getContent(contentId: string, language?: string): Observable<T> {
        const host = this.locationService.getLocation().host;
        const query = convertObjectToUrlQueryString({ language, host });
        return this.httpClient.get<T>(`${this.apiUrl}/${contentId}?${query}`);

    getAncestors(contentId: string, language?: string, select?: string): Observable<T[]> {
        const host = this.locationService.getLocation().host;
        const query = convertObjectToUrlQueryString({ language, host, select });
        return this.httpClient.get<T[]>(`${this.apiUrl}/ancestors/${contentId}?${query}`);
    }

    /**
     * Gets content items details by array of ids
     * @param ids
     * @param language (Optional)
     * @param [statuses] (Optional)
     * @param [isDeepPopulate] (Optional) if true, the content child items will be populated
     * @returns content items
     */
    getContentItems(ids: string[], language?: string, statuses?: number[], isDeepPopulate?: boolean): Observable<T[]> {
        const query = convertObjectToUrlQueryString({ language });
        const bodyReq = {
            ids,
            statuses,
            isDeepPopulate
        }
        return this.httpClient.post<T[]>(`${this.apiUrl}/getContentItems?${query}`, bodyReq).pipe(
            map((contents: T[]) => contents.map(content => Object.assign(content, { type: this.typeOfContent })))
        );
    }

    getContentChildren(parentId: string, language?: string): Observable<T[]> {
        const host = this.locationService.getLocation().host;
        const query = convertObjectToUrlQueryString({ language, host });
        return this.httpClient.get<T[]>(`${this.apiUrl}/children/${parentId}?${query}`);
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
     * Get content version detail
     * @param contentId
     * @param versionId
     * @param language
     */
    getContentVersion(contentId: string, versionId: string, language?: string): Observable<T> {
        const host = this.locationService.getLocation().host;
        const query = convertObjectToUrlQueryString({ versionId, language, host });
        return this.httpClient.get<T>(`${this.apiUrl}/version/${contentId}?${query}`);
    }

    getAllVersionsOfContent(contentId: string): Observable<T[]> {
        return this.httpClient.get<T[]>(`${this.apiUrl}/version/list/${contentId}`);
    }

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
     * Publish convent version
     * @param contentId
     * @param versionId
     * @returns content
     */
    publishContentVersion(contentId: string, versionId: string): Observable<T> {
        const host = this.locationService.getLocation().host;
        const query = convertObjectToUrlQueryString({ versionId, host });
        return this.httpClient.put<T>(`${this.apiUrl}/version/publish/${contentId}?${query}`, {});
    }

    setPrimaryVersion(versionId: string): Observable<T> {
        return this.httpClient.put<T>(`${this.apiUrl}/version/set-primary/${versionId}`, {});
    }
}
