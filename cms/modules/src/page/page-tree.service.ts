import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { PageService, LanguageService, Page, PAGE_TYPE } from '@angular-cms/core';

import { TreeService } from '../shared/tree/interfaces/tree-service';
import { TreeNode } from '../shared/tree/interfaces/tree-node';
import '../types/tree-node-extension';

@Injectable()
export class PageTreeService implements TreeService {

    constructor(private pageService: PageService, private languageService: LanguageService) { }

    getNode(nodeId: string): any {
        const language = this.languageService.getLanguageParam();
        return this.pageService.getContent(nodeId, language).pipe(
            map(page => TreeNode.createInstanceFromContent(page, PAGE_TYPE)));
    }

    loadChildren(parentNodeId: string): any {
        return this.pageService.getContentChildren(parentNodeId).pipe(
            map((childPages: Page[]) => {
                return childPages.map(page => TreeNode.createInstanceFromContent(page, PAGE_TYPE));
            }));
    }
}
