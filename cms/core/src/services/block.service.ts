import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Block } from '../models/block.model';
import { ContentService } from './content.service';

@Injectable({
  providedIn: 'root'
})
export class BlockService extends ContentService<Block> {

  protected apiUrl: string = "http://localhost:3000/api/block";
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }
}
