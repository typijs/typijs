import { Component, ViewChild } from '@angular/core';

import { Media, MediaService, MEDIA_TYPE } from '@angular-cms/core';
import { takeUntil } from 'rxjs/operators';

import { SubjectService } from '../shared/services/subject.service';
import { SubscriptionDestroy } from '../shared/subscription-destroy';
//import { TreeComponent, TreeConfig, TreeNode, NodeMenuItemAction, TreeMenuActionEvent } from '../shared/tree';
import { TreeComponent } from '../shared/tree/components/tree.component';
import { TreeConfig } from '../shared/tree/interfaces/tree-config';
import { NodeMenuItemAction, TreeMenuActionEvent } from '../shared/tree/interfaces/tree-menu';
import { TreeNode } from '../shared/tree/interfaces/tree-node';

import { MediaTreeService } from './media-tree.service';
import { UploadService } from './upload/upload.service';
import { FileModalComponent } from './upload/file-modal.component';

const MediaMenuItemAction = {
    DeleteFolder: 'DeleteFolder',
    NewFileUpload: 'NewFile'
}

@Component({
    template: `
        <div dragOver class="media-container">
            <div class="drop-zone" dragLeave>
                <file-drop [uploadFieldName]='"files"' [targetFolder]="selectedFolder"></file-drop>
            </div>
            <as-split direction="vertical" gutterSize="4">
                <as-split-area size="50">
                    <cms-tree 
                        class="tree-root pl-1 pt-2 d-block" 
                        [root]="root"
                        [config]="treeConfig"
                        (nodeSelected)="folderSelected($event)"
                        (nodeInlineCreated)="createMediaFolder($event)"
                        (nodeInlineUpdated)="updateMediaFolder($event)"
                        (menuItemSelected)="menuItemSelected($event)">
                        <ng-template #treeNodeTemplate let-node>
                            <span [ngClass]="{'media-node': node.id != '0', 'border-bottom': node.isSelected && node.id != '0'}">
                                <fa-icon class="mr-1" *ngIf="node.id == 0" [icon]="['fas', 'photo-video']"></fa-icon>
                                <fa-icon class="mr-1" *ngIf="node.id != 0" [icon]="['fas', 'folder']"></fa-icon>
                                <span class="node-name">{{node.name}}</span>
                                <span *ngIf="node.id == '0'" class="badge badge-info float-right mt-2 mr-1" (click)="clickToCreateFolder(node)">New Folder</span>
                            </span>
                        </ng-template>
                    </cms-tree>
                </as-split-area>
                <as-split-area size="50">
                    <div class="list-group list-media"  *ngIf="medias" #mediaItem>
                        <a *ngFor="let media of medias" 
                            [draggable] 
                            [dragData]="media"  
                            class="list-group-item list-group-item-action flex-column align-items-start p-1" 
                            [routerLink]="['content/media', media._id]">
                            <div class="d-flex align-items-center">
                                <img class="mr-1" [src]='media.path'/>
                                <div class="w-100 mr-2 text-truncate">{{media.name}}</div>
                                <fa-icon class="ml-auto" [icon]="['fas', 'bars']"></fa-icon>
                            </div>
                        </a>
                    </div>
                </as-split-area>
            </as-split>
            <file-modal></file-modal>
        </div>
        `,
    styleUrls: ['./media-tree.scss'],
    providers: [MediaTreeService]
})
export class MediaTreeComponent extends SubscriptionDestroy {

    @ViewChild(TreeComponent, { static: false }) cmsTree: TreeComponent;
    @ViewChild(FileModalComponent, { static: false }) fileModal: FileModalComponent;

    medias: Array<Media>;
    root: TreeNode;
    treeConfig: TreeConfig;
    selectedFolder: Partial<TreeNode>;

    constructor(
        private mediaTreeService: MediaTreeService,
        private mediaService: MediaService,
        private subjectService: SubjectService,
        private uploadService: UploadService) {
        super();
        this.root = new TreeNode({ id: '0', name: 'Media', hasChildren: true });
        this.treeConfig = this.initTreeConfiguration();
    }

    ngOnInit() {
        this.subjectService.mediaFolderCreated$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(createdFolder => {
                this.cmsTree.selectNode({ id: createdFolder._id, isNeedToScroll: true })
                this.cmsTree.reloadSubTree(createdFolder.parentId);
            });

        this.uploadService.uploadComplete$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(nodeId => {
                //Reload current node
                if (this.selectedFolder.id == nodeId) this.reloadSelectedFolder(nodeId);
            });

        this.folderSelected(this.root);
    }

    folderSelected(node: Partial<TreeNode>) {
        this.selectedFolder = node;
        this.reloadSelectedFolder(node.id);
    }

    private reloadSelectedFolder(folderId: string) {
        //load child block in folder
        this.mediaService.getContentInFolder(folderId).subscribe(childMedias => {
            childMedias.forEach(media => Object.assign(media, {
                type: MEDIA_TYPE,
                contentType: media.contentType,
                isPublished: media.isPublished
            }));
            this.medias = childMedias;
            this.medias.forEach(file => {
                file.path = `${this.mediaService.getImageUrl(file._id, file.name)}?w=50&h=50`;
            })
        })
    }

    clickToCreateFolder(node: TreeNode) {
        this.cmsTree.handleNodeMenuItemSelected({ action: NodeMenuItemAction.NewNodeInline, node: node })
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
            case MediaMenuItemAction.NewFileUpload:
                this.fileModal.openFileUploadModal(node);
                break;
            case MediaMenuItemAction.DeleteFolder:
                this.folderDelete(node);
                break;
        }
    }

    private folderDelete(nodeToDelete: TreeNode) {
        if (nodeToDelete.id == '0') return;
        this.mediaService.softDeleteContent(nodeToDelete.id).subscribe(([folderToDelete, deleteResult]: [Media, any]) => {
            console.log(deleteResult);
            this.cmsTree.reloadSubTree(nodeToDelete.parentId);
        });
    }

    private initTreeConfiguration(): TreeConfig {
        return {
            service: this.mediaTreeService,
            menuItems: [
                {
                    action: NodeMenuItemAction.NewNodeInline,
                    name: "New Folder"
                },
                {
                    action: MediaMenuItemAction.NewFileUpload,
                    name: "Upload"
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
                    action: MediaMenuItemAction.DeleteFolder,
                    name: "Delete"
                },
            ]
        }
    }
}