import { Component, Input, ComponentFactoryResolver, Inject, ViewChild, OnDestroy } from '@angular/core';
import { ContentService, ServiceLocator } from '@angular-cms/core';
import { TreeNode } from '../shared/content-tree/tree-node';
import { TreeService } from '../shared/content-tree/tree-service';
import { PageService } from './page.service';

@Component({
    template: `
        <li class="nav-item">
            <a class="nav-link">
                <i class="fa fa-sitemap fa-fw"></i> Pages <span class="badge badge-info" [routerLink]="['new/page']">NEW</span>
            </a>
        </li>
        <li class="nav-item nav-dropdown open tree">
            <content-tree [root]="root" [treeService]="pageService"></content-tree>
        </li>
        `,
    styles: [`
        .tree li {
            color:#fff;
          }
        `]
})
export class PageTreeComponent {
    root: TreeNode = null;
    pageService = ServiceLocator.Instance.get(PageService);

    ngOnInit() {
        this.root = new TreeNode('000000000000000000000000', "abc", "");
    }
}