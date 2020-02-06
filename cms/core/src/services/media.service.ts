import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Media } from '../models/media.model';
import { ContentService } from './content.service';

@Injectable()
export class MediaService extends ContentService<Media> {

  protected apiUrl: string = "/api/media";
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
