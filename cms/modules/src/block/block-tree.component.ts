import { Component, Input, ComponentFactoryResolver, Inject, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SubjectService, ServiceLocator, Block, BlockService } from '@angular-cms/core';
import { TreeNode, TreeService, TreeConfig, NodeMenuItemAction, TreeComponent } from '../shared/tree';
import { BlockTreeService } from './block-tree.service';

@Component({
    template: `
    <as-split direction="vertical" gutterSize="4">
        <as-split-area size="50">
            <div class="nav-item nav-dropdown open">
                <a class="nav-link">
                    <i class="fa fa-sitemap fa-fw"></i>
                    Blocks
                    <span class="badge badge-info" [routerLink]="['new/block']">NEW</span>
                </a>
                <ul class="nav-dropdown-items">
                    <li class="nav-item">
                        <cms-tree 
                            class="tree-root" 
                            [root]="root"
                            [config]="treeConfig"
                            (nodeSelected)="folderSelected($event)"
                            (nodeCreated)="nodeCreated($event)"
                            (nodeInlineCreated)="createBlockFolder($event)">
                            <ng-template #treeNodeTemplate let-node>
                                <i class="fa fa-folder-o"></i>
                                <span>{{node.name}}</span>
                            </ng-template>
                        </cms-tree>
                    </li>
                </ul>
            </div>
        </as-split-area>
        <as-split-area size="50">
            <div>
                <div class="list-group" *ngIf="blocks">
                    <div *ngFor="let block of blocks" [draggable] [dragData]="block"  class="list-group-item" [routerLink]="['content/block', block._id]">
                        {{block.name}}
                    </div>
                </div>
            </div>
        </as-split-area>
    </as-split>
        `
})
export class BlockTreeComponent {
    @ViewChild(TreeComponent) cmsTree: TreeComponent;
    blocks: Array<Block>;

    root: TreeNode = new TreeNode({ id: '0', name: 'Block' });
    treeConfig: TreeConfig = {
        service: ServiceLocator.Instance.get(BlockTreeService),
        menuItems: [
            {
                action: NodeMenuItemAction.NewNode,
                name: "New Block"
            },
            {
                action: NodeMenuItemAction.NewNodeInline,
                name: "New Folder"
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
        private router: Router,
        private route: ActivatedRoute,
        private blockService: BlockService,
        private subjectService: SubjectService) {
    }

    ngOnInit() {
        this.subjectService.blockFolderCreated$.subscribe(blockData => {
            //Todo: need to optimize only reload new node
            this.cmsTree.reloadNode(blockData._id);
        });
        this.folderSelected({ id: '0' });
    }

    folderSelected(node) {
        //load child block in folder
        this.blockService.getChildBlocksOfFolder(node.id).subscribe(childBlocks => {
            this.blocks = childBlocks;
        })
    }

    createBlockFolder(node: TreeNode) {
        this.blockService.addBlockContent({ name: node.name, parentId: node.parentId })
            .subscribe(block => {
                this.subjectService.fireBlockCreated(block);
            });
    }

    nodeCreated(parentNode) {
        this.router.navigate(["new/block", parentNode.id], { relativeTo: this.route })
    }

}