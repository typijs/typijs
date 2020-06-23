import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ContentService } from './content.service';
import { Block } from './models/block.model';


@Injectable({
  providedIn: 'root'
})
export class BlockService extends ContentService<Block> {

  protected apiUrl: string = `${this.baseApiUrl}/block`;
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
