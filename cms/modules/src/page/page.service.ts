import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';

import { ContentService } from '@angular-cms/core';
import { TreeService } from '../shared/content-tree/tree-service';
import { TreeNode } from '../shared/content-tree/tree-node';

@Injectable()
export class PageService implements TreeService {
    root: TreeNode;
    loadChildren: (key: string) => any = (key: string): any => {
        return this._contentService.getContentsByParentId(key);
    }

    constructor(private _contentService: ContentService) { }
}