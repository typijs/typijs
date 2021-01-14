import { LanguageService, MediaService } from '@angular-cms/core';
import { Injectable } from '@angular/core';
import { MediaTreeReadonlyService } from '../shared/dialog/media-dialog.component';
import '../types/tree-node-extension';

@Injectable()
export class MediaTreeService extends MediaTreeReadonlyService {
    constructor(mediaService: MediaService, languageService: LanguageService) { super(mediaService, languageService); }
}
