import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SubjectService, ServiceLocator } from '@angular-cms/core';
import { TreeNode } from '../shared/tree/tree-node';
import { TreeComponent } from '../shared/tree/tree.component';
import { TreeConfig } from '../shared/tree/tree-config';
import { NodeMenuItemAction } from '../shared/tree/tree-menu'
import { PageTreeService } from './page-tree.service';

@Component({
    template: `
    <div>
        <a class="nav-link">
            <i class="fa fa-sitemap fa-fw"></i>
            Pages
            <span class="badge badge-info" [routerLink]="['new/page']">NEW</span>
        </a>
        <cms-tree 
            class="tree-root" 
            [root]="root"
            [config]="treeConfig"
            (nodeSelected)="nodeSelected($event)"
            (nodeCreated)="nodeCreated($event)">
            <ng-template #treeNodeTemplate let-node>
                <i class="fa fa-folder-o"></i>
                <span>{{node.name}}</span>
            </ng-template>
        </cms-tree>
    </div>
        `,
    styles: [`
        .tree-root {
            margin-left: 10px;
            display:block;
        }
        `]
})
export class PageTreeComponent {
    @ViewChild(TreeComponent, { static: false }) cmsTree: TreeComponent;

    root: TreeNode = new TreeNode({ id: '0' });
    treeConfig: TreeConfig = {
        service: ServiceLocator.Instance.get(PageTreeService),
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

    constructor(
        private subjectService: SubjectService,
        private router: Router,
        private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.subjectService.pageCreated$.subscribe(pageData => {
            this.cmsTree.reloadNode(pageData.parentId);
        });

        this.subjectService.pageSelected$.subscribe(pageData => {
            this.cmsTree.locateToSelectedNode(new TreeNode({
                id: pageData._id,
                name: pageData.name,
                hasChildren: pageData.hasChildren,
                parentId: pageData.parentId,
                parentPath: pageData.parentPath
            }));
        });
    }

    nodeSelected(node) {
        this.router.navigate(["content/page", node.id], { relativeTo: this.route })
    }

    nodeCreated(parentNode) {
        this.router.navigate(["new/page", parentNode.id], { relativeTo: this.route })
    }
}