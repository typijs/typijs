import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Page, PageService } from '@typijs/core';
import { distinctUntilKeyChanged, takeUntil, takeWhile } from 'rxjs/operators';

import { CmsModalService } from '../shared/modal/modal.service';
import { SubjectService } from '../shared/services/subject.service';
import { SubscriptionDestroy } from '../shared/subscription-destroy';
import { TreeComponent } from '../shared/tree/components/tree.component';
import { TreeConfig } from '../shared/tree/interfaces/tree-config';
import { NodeMenuItemAction, TreeMenuActionEvent } from '../shared/tree/interfaces/tree-menu';
import { TreeNode } from '../shared/tree/interfaces/tree-node';
import { TreeService } from '../shared/tree/interfaces/tree-service';
import { PageTreeService } from './page-tree.service';


const PAGE_MENU_ACTION = {
    DeletePage: 'DeletePage',
    NewPage: 'NewPage'
};

@Component({
    templateUrl: './page-tree.component.html',
    styleUrls: ['./page-tree.scss'],
    providers: [PageTreeService, { provide: TreeService, useExisting: PageTreeService }]
})
export class PageTreeComponent extends SubscriptionDestroy implements OnInit {
    @ViewChild(TreeComponent) cmsTree: TreeComponent;

    root: TreeNode;
    treeConfig: TreeConfig;

    constructor(
        private pageService: PageService,
        private dialogService: CmsModalService,
        private subjectService: SubjectService,
        private router: Router,
        private route: ActivatedRoute) {
        super();
        this.root = new TreeNode({ id: '0', name: 'Root', hasChildren: true });
        this.treeConfig = this.initTreeConfiguration();
    }

    ngOnInit() {
        this.subjectService.pageCreated$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((createdPage: Page) => {
                // Reload parent page
                // Reload the children of parent to update the created page
                this.cmsTree.setSelectedNode({ id: createdPage._id, isNeedToScroll: true });
                this.cmsTree.reloadSubTree(createdPage.parentId);
            });

        this.subjectService.pageSelected$
            .pipe(
                distinctUntilKeyChanged('_id'),
                takeUntil(this.unsubscribe$)
            )
            .subscribe((selectedPage: Page) => {
                this.cmsTree.expandTreeToSelectedNode(new TreeNode({
                    id: selectedPage._id,
                    isNeedToScroll: true,
                    name: selectedPage.name,
                    hasChildren: selectedPage.hasChildren,
                    parentId: selectedPage.parentId,
                    parentPath: selectedPage.parentPath
                }));
            });
    }

    pageSelected(node: TreeNode) {
        if (node.id == '0') { return; }
        this.router.navigate(['content/page', node.id], { relativeTo: this.route });
    }

    menuItemSelected(nodeAction: TreeMenuActionEvent) {
        const { action, node } = nodeAction;
        switch (action) {
            case PAGE_MENU_ACTION.NewPage:
                this.pageCreating(node);
                break;
            case PAGE_MENU_ACTION.DeletePage:
                this.pageDelete(node);
                break;
        }
    }

    private pageCreating(parentNode: TreeNode) {
        this.router.navigate(['new/page', parentNode.id], { relativeTo: this.route });
    }

    private pageDelete(nodeToDelete: TreeNode) {
        if (nodeToDelete.id == '0') { return; }

        this.dialogService.confirm(`Delete the ${nodeToDelete.name}`, `Do you want to delete the page ${nodeToDelete.name}?`).pipe(
            takeWhile(confirm => confirm)
        ).subscribe(() => {
            this.pageService.moveContentToTrash(nodeToDelete.id).subscribe((pageToDelete: Page) => {
                if (pageToDelete.isDeleted) {
                    // if the deleted node is selected then need to set the parent node is the new selected node
                    if (nodeToDelete.isSelected) this.cmsTree.setSelectedNode({ id: pageToDelete.parentId, isNeedToScroll: true });
                    this.cmsTree.reloadSubTree(pageToDelete.parentId);
                }
            });
        });
    }

    private initTreeConfiguration(): TreeConfig {
        return {
            menuItems: [
                {
                    action: PAGE_MENU_ACTION.NewPage,
                    name: 'New Page'
                },
                {
                    action: NodeMenuItemAction.Cut,
                    name: 'Cut'
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
                    action: PAGE_MENU_ACTION.DeletePage,
                    name: 'Delete'
                },
            ]
        };
    }
}
