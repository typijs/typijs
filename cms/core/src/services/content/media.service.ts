import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { TypeOfContentEnum } from '../../types';
import { ContentService } from './content.service';
import { ContentData } from './models/content-data';
import { Media } from './models/media.model';

@Injectable({
    providedIn: 'root'
})
export class MediaService extends ContentService<Media> {

    protected apiUrl: string = `${this.baseApiUrl}/media`;
    private apiAssetUrl: string = `${this.baseApiUrl}/assets`;
    constructor(injector: Injector) {
        super(injector);
    }

    isMatching(typeOfContent: string) {
        return typeOfContent === TypeOfContentEnum.Media || typeOfContent === TypeOfContentEnum.FolderMedia
    }

    getContentData(content: Media): ContentData {
        throw new Error('Not implemented');
    }

    uploadMedia(folderId: string = '', file: File): Observable<HttpEvent<any>> {
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);

        const requestUrl = `${this.apiUrl}/upload/${folderId}`;
        // create a http-post request and pass the form
        // tell it to report the upload progress
        const req = new HttpRequest('POST', requestUrl, formData, {
            reportProgress: true
        });
        return this.httpClient.request(req);
    }

    /**
     * Gets image url
     * @param id The id of media
     * @param fileName File name must include the correct extension
     * @returns image url
     */
    getImageUrl(id: string, fileName: string): string {
        return `${this.apiAssetUrl}/${id}/${fileName}`;
    }
}
