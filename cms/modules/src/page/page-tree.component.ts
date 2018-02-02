import { Component, Input, ComponentFactoryResolver, Inject, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ContentService, ServiceLocator } from '@angular-cms/core';
import { TreeNode, TreeService, TreeConfig, NodeMenuItemAction } from '../shared/tree';
import { PageService } from './page.service';

@Component({
    template: `
        <li class="nav-item nav-dropdown open">
            <a class="nav-link">
                <i class="fa fa-sitemap fa-fw"></i>
                Pages
                <span class="badge badge-info" [routerLink]="['new/page']">NEW</span>
            </a>
            <ul class="nav-dropdown-items">
                <li class="nav-item">
                    <cms-tree 
                        class="tree-root" 
                        [root]="root"
                        [config]="treeConfig"
                        (nodeSelected)="nodeSelected($event)"
                        (nodeCreated)="nodeCreated($event)"></cms-tree>
                </li>
            </ul>
        </li>
        `,
    styles: [`
        .tree-root {
            margin-left: 10px;
            display:block;
        }
        `]
})
export class PageTreeComponent {
    root: TreeNode = new TreeNode('000000000000000000000000', "");
    treeConfig: TreeConfig = {
        service: ServiceLocator.Instance.get(PageService),
        menuItems: [
            {
                action: NodeMenuItemAction.NewNode,
                name: "New Page"
            },
            {
                action: NodeMenuItemAction.Cut,
                name: "Cut"
            },
            {
                action: NodeMenuItemAction.Copy,
                name: "Copy"
            },
            {
                action: NodeMenuItemAction.Paste,
                name: "Paste"
            },
            {
                action: NodeMenuItemAction.Delete,
                name: "Delete"
            },
        ]
    }

    constructor(private router: Router, private route: ActivatedRoute) {
    }

    ngOnInit() {
    }

    nodeSelected(node) {
        this.router.navigate(["content/page", node.id], { relativeTo: this.route })
    }

    nodeCreated(parentNode) {
        this.router.navigate(["new/page", parentNode.id], { relativeTo: this.route })
    }
}