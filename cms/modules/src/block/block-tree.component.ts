import { Block, BlockService, ContentTypeEnum } from '@typijs/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { distinctUntilKeyChanged, map, switchMap, takeUntil, takeWhile, tap } from 'rxjs/operators';
import { CmsModalService } from '../shared/modal/modal.service';
import { SubjectService } from '../shared/services/subject.service';
import { SubscriptionDestroy } from '../shared/subscription-destroy';
import { TreeComponent } from '../shared/tree/components/tree.component';
import { TreeConfig } from '../shared/tree/interfaces/tree-config';
import { NodeMenuItemAction, TreeMenuActionEvent } from '../shared/tree/interfaces/tree-menu';
import { TreeNode } from '../shared/tree/interfaces/tree-node';
import { TreeService } from '../shared/tree/interfaces/tree-service';
import { BlockTreeService } from './block-tree.service';


const BLOCK_MENU_ACTION = {
    DeleteFolder: 'DeleteFolder',
    NewBlock: 'NewBlock'
};

@Component({
    templateUrl: './block-tree.component.html',
    styleUrls: ['./block-tree.scss'],
    providers: [BlockTreeService, { provide: TreeService, useExisting: BlockTreeService }]
})
export class BlockTreeComponent extends SubscriptionDestroy implements OnInit {
    @ViewChild(TreeComponent) cmsTree: TreeComponent;

    folderSelected$: BehaviorSubject<Partial<TreeNode>>;
    refreshFolder$: Subject<Partial<TreeNode>>;
    blocks$: Observable<Block[]>;

    root: TreeNode;
    selectedFolder: Partial<TreeNode>;
    treeConfig: TreeConfig;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private modalService: CmsModalService,
        private blockService: BlockService,
        private subjectService: SubjectService) {
        super();
        this.root = new TreeNode({ id: '0', name: 'For All Sites', hasChildren: true });
        this.selectedFolder = this.root;
        this.treeConfig = this.initTreeConfiguration();

        this.folderSelected$ = new BehaviorSubject<Partial<TreeNode>>(this.root);
        this.refreshFolder$ = new Subject<Partial<TreeNode>>();
    }

    ngOnInit() {
        this.subjectService.blockFolderCreated$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(createdFolder => {
                this.cmsTree.setSelectedNode({ id: createdFolder._id, isNeedToScroll: true });
                this.cmsTree.reloadSubTree(createdFolder.parentId);
            });

        this.subjectService.blockCreated$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(createdBlock => {
                this.cmsTree.setSelectedNode({ id: createdBlock.parentId });
                // Reload current node
                if (this.selectedFolder.id === createdBlock.parentId) { this.refreshFolder$.next(this.selectedFolder); }
            });

        const setFolderSelected$ = this.folderSelected$.pipe(
            distinctUntilKeyChanged('id'),
            tap(node => this.selectedFolder = node)
        );

        this.blocks$ = merge(setFolderSelected$, this.refreshFolder$).pipe(
            switchMap(node => this.blockService.getContentInFolder(node.id)),
            map((blocks: Block[]) => blocks.map(block => Object.assign(block, {
                type: ContentTypeEnum.Block,
                contentType: block.contentType,
                isPublished: block.isPublished
            })))
        );
    }

    clickToCreateFolder(node: TreeNode) {
        this.cmsTree.handleNodeMenuItemSelected({ action: NodeMenuItemAction.NewNodeInline, node });
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
            case BLOCK_MENU_ACTION.NewBlock:
                this.blockCreated(node);
                break;
            case BLOCK_MENU_ACTION.DeleteFolder:
                this.folderDelete(node);
                break;
        }
    }

    private blockCreated(parentNode) {
        this.router.navigate(['new/block', parentNode.id], { relativeTo: this.route });
    }

    private folderDelete(nodeToDelete: TreeNode) {
        if (nodeToDelete.id === '0') { return; }

        this.modalService.confirm(`Delete ${nodeToDelete.name}`, `Do you want to delete the folder ${nodeToDelete.name}?`).pipe(
            takeWhile(confirm => confirm),
        ).subscribe(() => {
            this.blockService.moveContentToTrash(nodeToDelete.id).subscribe(folderToDelete => {
                if (folderToDelete.isDeleted) {
                    // if the deleted node is selected then need to set the parent node is the new selected node
                    if (nodeToDelete.isSelected) this.cmsTree.setSelectedNode({ id: folderToDelete.parentId, isNeedToScroll: true });
                    this.cmsTree.reloadSubTree(folderToDelete.parentId);
                }
            });
        })
    }

    private initTreeConfiguration(): TreeConfig {
        return {
            menuItems: [
                {
                    action: BLOCK_MENU_ACTION.NewBlock,
                    name: 'New Block'
                },
                {
                    action: NodeMenuItemAction.NewNodeInline,
                    name: 'New Folder'
                },
                {
                    action: NodeMenuItemAction.EditNowInline,
                    name: 'Rename'
                },
                {
                    action: NodeMenuItemAction.Copy,
                    name: 'Copy'
                },
                {
                    action: NodeMenuItemAction.Paste,
                    name: 'Paste'
                },
                {
                    action: BLOCK_MENU_ACTION.DeleteFolder,
                    name: 'Delete'
                },
            ]
        };
    }
}
