import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SubjectService, ServiceLocator, Block, BlockService } from '@angular-cms/core';
import { TreeNode } from '../shared/tree/tree-node';
import { TreeComponent } from '../shared/tree/tree.component';
import { TreeConfig } from '../shared/tree/tree-config';
import { NodeMenuItemAction } from '../shared/tree/tree-menu';
import { BlockTreeService } from './block-tree.service';
import { SubscriptionComponent } from '../shared/subscription.component';

@Component({
    template: `
    <as-split direction="vertical" gutterSize="4">
        <as-split-area size="50">
            <cms-tree 
                class="tree-root pl-1 pt-2 d-block" 
                [root]="root"
                [config]="treeConfig"
                (nodeSelected)="folderSelected($event)"
                (nodeCreated)="blockCreated($event)"
                (nodeInlineCreated)="createBlockFolder($event)"
                (nodeDeleteEvent)="folderDelete($event)">
                <ng-template #treeNodeTemplate let-node>
                    <span [ngClass]="{'block-node': node.id != '0', 'border-bottom': node.isSelected && node.id != '0'}">
                        <fa-icon class="mr-1" *ngIf="node.id == '0'" [icon]="['fas', 'cubes']"></fa-icon>
                        <fa-icon class="mr-1" *ngIf="node.id != '0'" [icon]="['fas', 'folder']"></fa-icon>
                        <span class="node-name">{{node.name}}</span>
                        <span *ngIf="node.id == '0'" class="badge badge-info float-right mt-2 mr-1" (click)="clickToCreateFolder(node)">New Folder</span>
                        <span *ngIf="node.id == '0'" class="badge badge-info float-right mt-2 mr-1" [routerLink]="['new/block']">New Block</span>
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
            border-bottom: 1px solid #a4b7c1!important;
        }
  `]
})
export class BlockTreeComponent extends SubscriptionComponent {
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
        super()
    }

    ngOnInit() {
        this.subscriptions.push(this.subjectService.blockFolderCreated$.subscribe(createdFolder => {
            this.cmsTree.selectNode({ id: createdFolder._id, isNeedToScroll: true })
            this.cmsTree.reloadSubTree(createdFolder.parentId);
        }));
        this.subscriptions.push(this.subjectService.blockCreated$.subscribe(createdBlock => {
            this.cmsTree.selectNode({ id: createdBlock.parentId })
        }));
        this.folderSelected({ id: '0' });
    }

    folderSelected(node) {
        //load child block in folder
        this.blockService.getContentInFolder(node.id).subscribe(childBlocks => {
            this.blocks = childBlocks;
        })
    }

    createBlockFolder(node: TreeNode) {
        this.blockService.createFolder({ name: node.name, parentId: node.parentId })
            .subscribe(block => {
                this.subjectService.fireBlockFolderCreated(block);
            });
    }

    clickToCreateFolder(node: TreeNode) {
        this.cmsTree.menuItemSelected({ action: NodeMenuItemAction.NewNodeInline, node: node })
    }

    blockCreated(parentNode) {
        this.router.navigate(["new/block", parentNode.id], { relativeTo: this.route })
    }

    folderDelete(nodeToDelete: TreeNode) {
        if (nodeToDelete.id == '0') return;
        this.blockService.softDeleteContent(nodeToDelete.id).subscribe(([blockToDelete, deleteResult]: [Block, any]) => {
            console.log(deleteResult);
            this.cmsTree.reloadSubTree(nodeToDelete.parentId);
        });
    }

}