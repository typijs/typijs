import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SubjectService, ServiceLocator, Block, BlockService } from '@angular-cms/core';
import { TreeNode } from '../shared/tree/tree-node';
import { TreeComponent } from '../shared/tree/tree.component';
import { TreeConfig } from '../shared/tree/tree-config';
import { NodeMenuItemAction } from '../shared/tree/tree-menu';
import { BlockTreeService } from './block-tree.service';

@Component({
    template: `
    <as-split direction="vertical" gutterSize="4">
        <as-split-area size="50">
            <cms-tree 
                class="tree-root pl-1 pt-2 d-block" 
                [root]="root"
                [config]="treeConfig"
                (nodeSelected)="folderSelected($event)"
                (nodeCreated)="nodeCreated($event)"
                (nodeInlineCreated)="createBlockFolder($event)">
                <ng-template #treeNodeTemplate let-node>
                    <span [ngClass]="{'block-node': node.id != 0}">
                        <fa-icon class="mr-1" *ngIf="node.id == 0" [icon]="['fas', 'cubes']"></fa-icon>
                        <fa-icon class="mr-1" *ngIf="node.id != 0" [icon]="['fas', 'folder']"></fa-icon>
                        <span class="node-name">{{node.name}}</span>
                        <span *ngIf="node.id == 0" class="badge badge-info float-right mt-2 mr-1" (click)="clickToCreateFolder(node)">New Folder</span>
                        <span *ngIf="node.id == 0" class="badge badge-info float-right mt-2 mr-1" [routerLink]="['new/block']">New Block</span>
                    </span>
                </ng-template>
            </cms-tree>
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
        `,
    styles: [`
        .block-node {
            width: calc(100% - 20px);
            cursor: pointer;
            display: inline-block;
        }

        .block-node:hover {
            font-weight: bold;
        }
  `]
})
export class BlockTreeComponent {
    @ViewChild(TreeComponent, { static: false }) cmsTree: TreeComponent;
    blocks: Array<Block>;

    root: TreeNode = new TreeNode({ id: '0', name: 'Block', hasChildren: true });
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
            //TODO: need to optimize only reload new node
            this.cmsTree.reloadSubTree(blockData._id);
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

    clickToCreateFolder(node: TreeNode) {
        this.cmsTree.menuItemSelected({ action: NodeMenuItemAction.NewNodeInline, node: node })
    }

    nodeCreated(parentNode) {
        this.router.navigate(["new/block", parentNode.id], { relativeTo: this.route })
    }

}