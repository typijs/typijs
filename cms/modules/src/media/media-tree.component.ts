import { Media, MediaService, ContentTypeEnum, VersionStatus } from '@typijs/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
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
import { MediaTreeService } from './media-tree.service';
import { FileModalComponent } from './upload/file-modal.component';
import { FileUploadProgress, UploadService } from './upload/upload.service';

const MEDIA_MENU_ACTION = {
    NewFileUpload: 'NewFile',
    DeleteFolder: 'DeleteFolder'
};

@Component({
    templateUrl: './media-tree.component.html',
    styleUrls: ['./media-tree.scss'],
    providers: [MediaTreeService, { provide: TreeService, useExisting: MediaTreeService }]
})
export class MediaTreeComponent extends SubscriptionDestroy implements OnInit {

    @ViewChild(TreeComponent, { static: true }) cmsTree: TreeComponent;

    folderSelected$: BehaviorSubject<Partial<TreeNode>>;
    refreshFolder$: Subject<Partial<TreeNode>>;
    medias$: Observable<Media[]>;

    root: TreeNode;
    selectedFolder: Partial<TreeNode>;
    treeConfig: TreeConfig;

    constructor(
        private mediaService: MediaService,
        private dialogService: CmsModalService,
        private modalService: BsModalService,
        private subjectService: SubjectService,
        private uploadService: UploadService) {
        super();
        this.root = new TreeNode({ id: '0', name: 'For All Sites', hasChildren: true });
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
                type: ContentTypeEnum.Media,
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
                this.openFileUploadModal({ uploadFolder: node });
                break;
            case MEDIA_MENU_ACTION.DeleteFolder:
                this.folderDelete(node);
                break;
        }
    }

    onFilesDropped(files: File[]) {
        this.uploadService.uploadFiles(files, this.selectedFolder)
            .subscribe(uploadProgress => {
                this.openFileUploadModal(uploadProgress);
            });
    }

    private openFileUploadModal(uploadProgress: FileUploadProgress) {
        const config: ModalOptions<FileModalComponent> = {
            initialState: uploadProgress,
            backdrop: true, // Show backdrop
            keyboard: false, // Esc button option
            ignoreBackdropClick: true, // Backdrop click to hide,
            animated: false,
            class: 'modal-md'
        }

        this.modalService.show(FileModalComponent, config);
    }

    private folderDelete(nodeToDelete: TreeNode) {
        if (nodeToDelete.id == '0') { return; }

        this.dialogService.confirm(`Delete ${nodeToDelete.name}`, `Do you want to delete the folder ${nodeToDelete.name}?`).pipe(
            takeWhile(confirm => confirm),
        ).subscribe(() => {
            this.mediaService.moveContentToTrash(nodeToDelete.id).subscribe(folderToDelete => {
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
