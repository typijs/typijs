import { Component, ViewChild } from '@angular/core';

import { ServiceLocator } from '@angular-cms/core';

import { TreeNode } from '../shared/tree/tree-node';
import { TreeComponent } from '../shared/tree/tree.component';
import { TreeConfig } from '../shared/tree/tree-config';
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
    @ViewChild(TreeComponent, { static: false }) cmsTree: TreeComponent;

    root: TreeNode = new TreeNode({ id: '0' });
    treeConfig: TreeConfig = {
        service: ServiceLocator.Instance.get(PageTreeService),
    }

    constructor(
    ) {
    }
}