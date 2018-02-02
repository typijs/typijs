import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { ContentService } from '@angular-cms/core';
import { TreeService } from '../shared/tree/tree-service';
import { TreeNode } from '../shared/tree/tree-node';

@Injectable()
export class PageService implements TreeService {
    reloadNode$: Subject<string> = new Subject<string>();

    constructor(private contentService: ContentService) { 
        this.contentService.contentCreated$.subscribe(content=>{
            this.reloadNode$.next(content.parentId);
        });
    }

    loadChildren(key: string): any {
        return this.contentService.getContentsByParentId(key);
    }
}