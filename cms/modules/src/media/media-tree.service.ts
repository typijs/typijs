import { LanguageService, MediaService } from '@typijs/core';
import { Injectable } from '@angular/core';
import { MediaTreeReadonlyService } from '../content-modal/media-modal.component';
import '../types/tree-node-extension';

@Injectable()
export class MediaTreeService extends MediaTreeReadonlyService {
    constructor(mediaService: MediaService, languageService: LanguageService) { super(mediaService, languageService); }
}
