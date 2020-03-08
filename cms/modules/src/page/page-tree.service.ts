import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { PageService, Page, PAGE_TYPE } from '@angular-cms/core';

import { TreeService } from '../shared/tree/interfaces/tree-service';
import { TreeNode } from '../shared/tree/interfaces/tree-node';
import { ContentTreeNode } from '../constants';

@Injectable()
export class PageTreeService implements TreeService {

    constructor(private pageService: PageService) { }

    getNode(nodeId: string): any {
        return this.pageService.getContent(nodeId).pipe(
            map(page => new TreeNode({
                id: page._id,
                name: page.name,
                hasChildren: page.hasChildren,
                parentId: page.parentId,
                parentPath: page.parentPath,
                extendProperties: <ContentTreeNode>{
                    type: PAGE_TYPE,
                    contentType: page.contentType,
                    isPublished: page.isPublished
                }
            })));
    }

    loadChildren(parentNodeId: string): any {
        return this.pageService.getContentChildren(parentNodeId).pipe(
            map((childPages: Page[]) => {
                return childPages.map(page => new TreeNode({
                    id: page._id,
                    name: page.name,
                    hasChildren: page.hasChildren,
                    parentId: page.parentId,
                    parentPath: page.parentPath,
                    extendProperties: <ContentTreeNode>{
                        type: PAGE_TYPE,
                        contentType: page.contentType,
                        isPublished: page.isPublished
                    }
                }));
            }));
    }
}