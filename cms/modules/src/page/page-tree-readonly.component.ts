import { Component, Input, ComponentFactoryResolver, Inject, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SubjectService, ServiceLocator } from '@angular-cms/core';
import { TreeNode, TreeService, TreeConfig, NodeMenuItemAction, TreeComponent } from '../shared/tree';
import { PageTreeService } from './page-tree.service';

@Component({
    template: `
        <li class="nav-item nav-dropdown open">
            <ul class="nav-dropdown-items">
                <li class="nav-item">
                    <cms-tree 
                        class="tree-root" 
                        [root]="root"
                        [config]="treeConfig">
                        <ng-template #treeNodeTemplate let-node>
                            <i class="fa fa-folder-o"></i>
                            <span>{{node.name}}</span>
                        </ng-template>
                    </cms-tree>
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
export class PageTreeReadonlyComponent {
    @ViewChild(TreeComponent) cmsTree: TreeComponent;

    root: TreeNode = new TreeNode({ id: '0' });
    treeConfig: TreeConfig = {
        service: ServiceLocator.Instance.get(PageTreeService),
    }

    constructor(
        private subjectService: SubjectService,
        private router: Router,
        private route: ActivatedRoute) {
    }
}