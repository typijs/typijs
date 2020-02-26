import { Component, ViewChild } from '@angular/core';

import { Media, MediaService, ServiceLocator } from '@angular-cms/core';

import { SubjectService } from '../shared/services/subject.service';
import { SubscriptionComponent } from '../shared/subscription.component';
import { TreeComponent } from '../shared/tree/components/tree.component';
import { TreeConfig } from '../shared/tree/interfaces/tree-config';
import { NodeMenuItemAction } from '../shared/tree/interfaces/tree-menu';
import { TreeNode } from '../shared/tree/interfaces/tree-node';

import { MediaTreeService } from './media-tree.service';
import { UploadService } from './upload/upload.service';

@Component({
    template: `
        <div dragOver class="media-container">
            <div class="drop-zone" dragLeave>
                <file-drop [uploadFieldName]='"files"'></file-drop>
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
                        (nodeDeleteEvent)="folderDelete($event)">
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
                    <div class="media-content list-group"  *ngIf="medias" #mediaItem>
                        <div *ngFor="let media of medias" [draggable] [dragData]="media" class="list-group-item">
                            <img [src]='media["path"]'/>
                            {{media.name}}
                        </div>
                    </div>
                </as-split-area>
            </as-split>
            <file-dialog></file-dialog>
        </div>
        `,
    styles: [`
        .media-container{
            height:100%;
        }

        .media-node {
            width: calc(100% - 20px);
            cursor: pointer;
            display: inline-block;
        }

        .media-node:hover {
            font-weight: bold;
            border-bottom: 1px solid #a4b7c1!important;
        }
        
        .drop-zone {
            height: calc(100vh - 55px);
            position: relative;
            z-index: 99;
            display: none;
            margin: -2px;
            background-color: #999;
        }

        .drag-over .media-content{
            display: none;
        }

        .drag-over .drop-zone{
            display: block;
        }
  `]
})
export class MediaTreeComponent extends SubscriptionComponent {

    @ViewChild(TreeComponent, { static: false }) cmsTree: TreeComponent;
    medias: Array<Media>;

    root: TreeNode = new TreeNode({ id: '0', name: 'Media', hasChildren: true });
    treeConfig: TreeConfig = {
        service: ServiceLocator.Instance.get(MediaTreeService),
        menuItems: [
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
                action: NodeMenuItemAction.Delete,
                name: "Delete"
            },
        ]
    }

    constructor(
        private mediaService: MediaService,
        private subjectService: SubjectService,
        private uploadService: UploadService) {
        super();
    }

    ngOnInit() {
        this.subscriptions.push(this.subjectService.mediaFolderCreated$.subscribe(createdFolder => {
            this.cmsTree.selectNode({ id: createdFolder._id, isNeedToScroll: true })
            this.cmsTree.reloadSubTree(createdFolder.parentId);
        }));

        this.subscriptions.push(this.uploadService.uploadComplete$.subscribe(nodeId => {
            //Reload current node
            this.folderSelected({ id: nodeId });
        }));
        this.folderSelected({ id: '0' });
    }

    folderSelected(node) {
        this.uploadService.setParentFolder(node);
        //load child block in folder
        this.mediaService.getContentInFolder(node.id).subscribe(childMedias => {
            this.medias = childMedias;
            this.medias.forEach(x => {
                x["path"] = `http://localhost:3000/api/assets/${x._id}/${x.name}?w=50&h=50`;
            })
        })
    }

    clickToCreateFolder(node: TreeNode) {
        this.cmsTree.menuItemSelected({ action: NodeMenuItemAction.NewNodeInline, node: node })
    }

    createMediaFolder(node: TreeNode) {
        this.mediaService.createFolder({ name: node.name, parentId: node.parentId })
            .subscribe(folder => {
                this.subjectService.fireMediaFolderCreated(folder);
            });
    }

    updateMediaFolder(node: TreeNode) {
        this.mediaService.editFolder({ name: node.name, _id: node.id })
            .subscribe(folder => {
                //this.subjectService.fireBlockFolderCreated(folder);
            });
    }

    folderDelete(nodeToDelete: TreeNode) {
        if (nodeToDelete.id == '0') return;
        this.mediaService.softDeleteContent(nodeToDelete.id).subscribe(([folderToDelete, deleteResult]: [Media, any]) => {
            console.log(deleteResult);
            this.cmsTree.reloadSubTree(nodeToDelete.parentId);
        });
    }
}