import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Media } from './models/media.model';
import { ContentService } from './content.service';

@Injectable({
  providedIn: 'root'
})
export class MediaService extends ContentService<Media> {

  protected apiUrl: string = `${this.baseApiUrl}/media`;
  private apiAssetUrl: string = `${this.baseApiUrl}/assets`;
  constructor(httpClient: HttpClient) {
    super(httpClient);
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
