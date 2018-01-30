import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { ContentService } from '@angular-cms/core';
import { TreeService } from '../shared/tree/tree-service';
import { TreeNode } from '../shared/tree/tree-node';

@Injectable()
export class PageService implements TreeService {
    constructor(private _contentService: ContentService) { }

    loadChildren: (key: string) => any = (key: string): any => {
        return this._contentService.getContentsByParentId(key);
    }
}