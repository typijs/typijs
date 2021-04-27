import { LanguageService, PageService } from '@typijs/core';
import { Injectable } from '@angular/core';
import { PageTreeReadonlyService } from '../content-modal/page-modal.component';
import '../types/tree-node-extension';

@Injectable()
export class PageTreeService extends PageTreeReadonlyService {
    constructor(pageService: PageService, languageService: LanguageService) { super(pageService, languageService); }
}
