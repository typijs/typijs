import { Media, MediaService, MEDIA_TYPE, VersionStatus } from '@angular-cms/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { distinctUntilKeyChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { SubjectService } from '../shared/services/subject.service';
import { SubscriptionDestroy } from '../shared/subscription-destroy';
import { TreeComponent } from '../shared/tree/components/tree.component';
import { TreeConfig } from '../shared/tree/interfaces/tree-config';
import { NodeMenuItemAction, TreeMenuActionEvent } from '../shared/tree/interfaces/tree-menu';
import { TreeNode } from '../shared/tree/interfaces/tree-node';
import { TreeService } from '../shared/tree/interfaces/tree-service';
import { MediaTreeService } from './media-tree.service';
import { FileModalComponent } from './upload/file-modal.component';
import { UploadService } from './upload/upload.service';


const MEDIA_MENU_ACTION = {
    DeleteFolder: 'DeleteFolder',
    NewFileUpload: 'NewFile'
};

@Component({
    template: `
        <div dragOver class="media-container">
            <div class="drop-zone" dragLeave>
                <file-drop [uploadFieldName]='"files"' [targetFolder]="selectedFolder"></file-drop>
            </div>
            <as-split direction="vertical" gutterSize="4">
                <as-split-area size="50">
                    <div class="position-relative">
                        <cms-tree
                            class="tree-root pl-1 pt-2 d-block"
                            [root]="root"
                            [config]="treeConfig"
                            (nodeSelected)="folderSelected$.next($event)"
                            (nodeInlineCreated)="createMediaFolder($event)"
                            (nodeInlineUpdated)="updateMediaFolder($event)"
                            (menuItemSelected)="menuItemSelected($event)">
                            <ng-template #treeNodeTemplate let-node>
                                <span [ngClass]="{'media-node': node.id != '0', 'border-bottom': node.isSelected && node.id != '0'}">
                                    <fa-icon class="mr-1" *ngIf="node.id == 0" [icon]="['fas', 'photo-video']"></fa-icon>
                                    <fa-icon class="mr-1" *ngIf="node.id != 0" [icon]="['fas', 'folder']"></fa-icon>
                                    <span class="node-name">{{node.name}}</span>

                                </span>
                            </ng-template>
                        </cms-tree>
                        <div class='toolbar mt-2 mr-1'>
                            <button type="button"
                                class="btn btn-xs btn-secondary float-right mr-1"
                                (click)="clickToCreateFolder(root)">
                                <fa-icon [icon]="['fas', 'folder-plus']"></fa-icon>
                            </button>
                        </div>
                    </div>
                </as-split-area>
                <as-split-area size="50">
                    <div class="list-group list-media"  *ngIf="medias$ |async as medias" #mediaItem>
                        <a *ngFor="let media of medias"
                            [draggable]
                            [dragData]="media"
                            href="javascript:void(0)"
                            class="list-group-item list-group-item-action p-2">
                            <div class="d-flex align-items-center">
                                <img width='50' class="mr-1" [src]='media.thumbnail | toImgSrc' [routerLink]="['content/media', media._id]"/>
                                <div class="w-100 mr-2 text-truncate" [routerLink]="['content/media', media._id]">{{media.name}}</div>
                                <div class="hover-menu ml-auto" dropdown container="body">
                                    <fa-icon class="mr-1" [icon]="['fas', 'bars']" dropdownToggle></fa-icon>
                                    <div class="cms-dropdown-menu dropdown-menu dropdown-menu-right"
                                        *dropdownMenu
                                        aria-labelledby="simple-dropdown">
                                        <a class="dropdown-item p-2" href="javascript:void(0)" [routerLink]="['content/media', media._id]">
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
            <file-modal></file-modal>
        </div>
        `,
    styleUrls: ['./media-tree.scss'],
    providers: [MediaTreeService, { provide: TreeService, useExisting: MediaTreeService }]
})
export class MediaTreeComponent extends SubscriptionDestroy implements OnInit {

    @ViewChild(TreeComponent) cmsTree: TreeComponent;
    @ViewChild(FileModalComponent) fileModal: FileModalComponent;

    folderSelected$: BehaviorSubject<Partial<TreeNode>>;
    refreshFolder$: Subject<Partial<TreeNode>>;
    medias$: Observable<Media[]>;

    root: TreeNode;
    selectedFolder: Partial<TreeNode>;
    treeConfig: TreeConfig;

    constructor(
        private mediaService: MediaService,
        private subjectService: SubjectService,
        private uploadService: UploadService) {
        super();
        this.root = new TreeNode({ id: '0', name: 'Media', hasChildren: true });
        this.selectedFolder = this.root;
        this.treeConfig = this.initTreeConfiguration();

        this.folderSelected$ = new BehaviorSubject<Partial<TreeNode>>(this.root);
        this.refreshFolder$ = new Subject<Partial<TreeNode>>();
    }

    ngOnInit() {
        this.subjectService.mediaFolderCreated$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(createdFolder => {
                this.cmsTree.setSelectedNode({ id: createdFolder._id, isNeedToScroll: true });
                this.cmsTree.reloadSubTree(createdFolder.parentId);
            });

        this.uploadService.uploadComplete$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(nodeId => {
                // Reload current node
                if (this.selectedFolder.id === nodeId) { this.refreshFolder$.next(this.selectedFolder); }
            });

        const setFolderSelected$ = this.folderSelected$.pipe(
            distinctUntilKeyChanged('id'),
            tap(node => this.selectedFolder = node)
        );
        this.medias$ = merge(setFolderSelected$, this.refreshFolder$).pipe(
            switchMap(node => this.mediaService.getContentInFolder(node.id)),
            map((medias: Media[]) => medias.map(media => Object.assign(media, {
                type: MEDIA_TYPE,
                contentType: media.contentType,
                isPublished: media.status === VersionStatus.Published
            })))
        );
    }

    clickToCreateFolder(node: TreeNode) {
        this.cmsTree.handleNodeMenuItemSelected({ action: NodeMenuItemAction.NewNodeInline, node });
    }

    createMediaFolder(node: TreeNode) {
        this.mediaService.createFolder({ name: node.name, parentId: node.parentId })
            .subscribe(folder => {
                this.subjectService.fireMediaFolderCreated(folder);
            });
    }

    updateMediaFolder(node: TreeNode) {
        this.mediaService.editFolder({ name: node.name, _id: node.id })
            .subscribe();
    }

    menuItemSelected(nodeAction: TreeMenuActionEvent) {
        const { action, node } = nodeAction;
        switch (action) {
            case MEDIA_MENU_ACTION.NewFileUpload:
                this.fileModal.openFileUploadModal(node);
                break;
            case MEDIA_MENU_ACTION.DeleteFolder:
                this.folderDelete(node);
                break;
        }
    }

    private folderDelete(nodeToDelete: TreeNode) {
        if (nodeToDelete.id == '0') { return; }
        this.mediaService.moveContentToTrash(nodeToDelete.id).subscribe(folderToDelete => {
            if (folderToDelete.isDeleted) {
                // if the deleted node is selected then need to set the parent node is the new selected node
                if (nodeToDelete.isSelected) this.cmsTree.setSelectedNode({ id: folderToDelete.parentId, isNeedToScroll: true });
                this.cmsTree.reloadSubTree(folderToDelete.parentId);
            }
        });
    }

    private initTreeConfiguration(): TreeConfig {
        return {
            menuItems: [
                {
                    action: NodeMenuItemAction.NewNodeInline,
                    name: 'New Folder'
                },
                {
                    action: MEDIA_MENU_ACTION.NewFileUpload,
                    name: 'Upload'
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
                    action: MEDIA_MENU_ACTION.DeleteFolder,
                    name: 'Delete'
                },
            ]
        };
    }
}
