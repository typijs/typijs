import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ServiceLocator, Block, BlockService } from '@angular-cms/core';
import { TreeNode } from '../shared/tree/interfaces/tree-node';
import { TreeComponent } from '../shared/tree/components/tree.component';
import { TreeConfig } from '../shared/tree/interfaces/tree-config';
import { NodeMenuItemAction, TreeMenuActionEvent } from '../shared/tree/interfaces/tree-menu';
import { BlockTreeService } from './block-tree.service';
import { SubscriptionDestroy } from '../shared/subscription-destroy';
import { SubjectService } from '../shared/services/subject.service';
import { ContentTreeNode, BLOCK_TYPE } from '../constants';

const BlockMenuItemAction = {
    DeleteFolder: 'DeleteFolder',
    NewBlock: 'NewBlock'
}

@Component({
    template: `
    <as-split direction="vertical" gutterSize="4">
        <as-split-area size="50">
            <cms-tree 
                class="tree-root pl-1 pt-2 d-block" 
                [root]="root"
                [config]="treeConfig"
                (nodeSelected)="folderSelected($event)"
                (nodeInlineCreated)="createBlockFolder($event)"
                (nodeInlineUpdated)="updateBlockFolder($event)"
                (menuItemSelected)="menuItemSelected($event)">
                <ng-template #treeNodeTemplate let-node>
                    <span [ngClass]="{'block-node': node.id != '0', 'border-bottom': node.isSelected && node.id != '0'}">
                        <fa-icon class="mr-1" *ngIf="node.id == '0'" [icon]="['fas', 'cubes']"></fa-icon>
                        <fa-icon class="mr-1" *ngIf="node.id != '0'" [icon]="['fas', 'folder']"></fa-icon>
                        <span class="node-name">{{node.name}}</span>
                        <fa-icon [icon]="['fas', 'folder-plus']" *ngIf="node.id == '0'" class="float-right mr-1" size="lg" (click)="clickToCreateFolder(node)"></fa-icon>
                        <fa-icon [icon]="['fas', 'plus-square']" *ngIf="node.id == '0'" class="float-right mr-1" size="lg" [routerLink]="['new/block']"></fa-icon>
                    </span>
                </ng-template>
            </cms-tree>
        </as-split-area>
        <as-split-area size="50">
            <div class="list-group" *ngIf="blocks">
                <a *ngFor="let block of blocks" 
                    [draggable] 
                    [dragData]="block"  
                    href="javascript:void(0)"
                    class="list-group-item list-group-item-action p-2">
                    <div class="d-flex align-items-center">
                        <fa-icon class="mr-1" [icon]="['fas', 'cube']"></fa-icon>
                        <div class="w-100 mr-2 text-truncate" [routerLink]="['content/block', block._id]">{{block.name}}</div>
                        <div class="item-menu ml-auto" dropdown container="body">
                            <fa-icon class="mr-1" [icon]="['fas', 'bars']" dropdownToggle></fa-icon>
                            <div class="node-menu-dropdown dropdown-menu dropdown-menu-right" *dropdownMenu aria-labelledby="simple-dropdown">
                                <a class="dropdown-item p-2" href="javascript:void(0)" [routerLink]="['content/block', block._id]">
                                    Edit
                                </a>
                                <a class="dropdown-item p-2" href="javascript:void(0)">
                                    Delete
                                </a>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        </as-split-area>
    </as-split>
        `,
    styleUrls: ['./block-tree.component.scss']
})
export class BlockTreeComponent extends SubscriptionDestroy {
    @ViewChild(TreeComponent, { static: false }) cmsTree: TreeComponent;
    blocks: Array<Block>;

    root: TreeNode = new TreeNode({ id: '0', name: 'Block', hasChildren: true });
    treeConfig: TreeConfig = {
        service: ServiceLocator.Instance.get(BlockTreeService),
        menuItems: [
            {
                action: BlockMenuItemAction.NewBlock,
                name: "New Block"
            },
            {
                action: NodeMenuItemAction.NewNodeInline,
                name: "New Folder"
            },
            {
                action: NodeMenuItemAction.EditNowInline,
                name: "Rename"
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
                action: BlockMenuItemAction.DeleteFolder,
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

    clickToCreateFolder(node: TreeNode) {
        this.cmsTree.handleNodeMenuItemSelected({ action: NodeMenuItemAction.NewNodeInline, node: node })
    }

    folderSelected(node) {
        //load child block in folder
        this.blockService.getContentInFolder(node.id).subscribe((childBlocks: Block[]) => {
            childBlocks.forEach(block => Object.assign(block, {
                extendProperties: <ContentTreeNode>{
                    type: BLOCK_TYPE,
                    contentType: block.contentType,
                    isPublished: block.isPublished
                }
            }));
            this.blocks = childBlocks
        })
    }

    createBlockFolder(node: TreeNode) {
        this.blockService.createFolder({ name: node.name, parentId: node.parentId })
            .subscribe(folder => {
                this.subjectService.fireBlockFolderCreated(folder);
            });
    }

    updateBlockFolder(node: TreeNode) {
        this.blockService.editFolder({ name: node.name, _id: node.id })
            .subscribe();
    }

    menuItemSelected(nodeAction: TreeMenuActionEvent) {
        const { action, node } = nodeAction;
        switch (action) {
            case BlockMenuItemAction.NewBlock:
                this.blockCreated(node);
                break;
            case BlockMenuItemAction.DeleteFolder:
                this.folderDelete(node);
                break;
        }
    }

    private blockCreated(parentNode) {
        this.router.navigate(["new/block", parentNode.id], { relativeTo: this.route })
    }

    private folderDelete(nodeToDelete: TreeNode) {
        if (nodeToDelete.id == '0') return;
        this.blockService.softDeleteContent(nodeToDelete.id).subscribe(([blockToDelete, deleteResult]: [Block, any]) => {
            console.log(deleteResult);
            this.cmsTree.reloadSubTree(nodeToDelete.parentId);
        });
    }
}