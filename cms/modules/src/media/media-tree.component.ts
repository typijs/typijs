import { Component, ViewChild } from '@angular/core';

import { SubjectService, ServiceLocator, Media, MediaService } from '@angular-cms/core';
import { TreeNode } from '../shared/tree/tree-node';
import { TreeComponent } from '../shared/tree/tree.component';
import { TreeConfig } from '../shared/tree/tree-config';
import { NodeMenuItemAction } from '../shared/tree/tree-menu';

import { MediaTreeService } from './media-tree.service';
import { UploadService } from './upload/upload.service';
import { SubscriptionComponent } from '../shared/subscription.component';

@Component({
    template: `
        <div dragOver class="media-container">
            <div class="drop-zone" dragLeave>
                <file-upload [uploadFieldName]='"files"'></file-upload>
            </div>
            <as-split direction="vertical" gutterSize="4">
                <as-split-area size="50">
                    <cms-tree 
                        class="tree-root pl-1 pt-2 d-block" 
                        [root]="root"
                        [config]="treeConfig"
                        (nodeSelected)="folderSelected($event)"
                        (nodeInlineCreated)="createMediaFolder($event)">
                        <ng-template #treeNodeTemplate let-node>
                            <fa-icon class="mr-1" *ngIf="node.id == 0" [icon]="['fas', 'photo-video']"></fa-icon>
                            <fa-icon class="mr-1" *ngIf="node.id != 0" [icon]="['fas', 'folder']"></fa-icon>
                            <span class="node-name">{{node.name}}</span>
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
                action: NodeMenuItemAction.NewNode,
                name: "New Media"
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
        private mediaService: MediaService,
        private subjectService: SubjectService,
        private uploadService: UploadService) {
        super();
    }

    ngOnInit() {
        this.subscriptions.push(this.subjectService.mediaFolderCreated$.subscribe(createdFolder => {
            //TODO: need to optimize only reload new node
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
                x["path"] = `/api/assets/${x._id}/${x.name}?w=50`;
            })
        })
    }

    createMediaFolder(node: TreeNode) {
        this.mediaService.createFolder({ name: node.name, parentId: node.parentId })
            .subscribe(block => {
                this.subjectService.fireMediaFolderCreated(block);
            });
    }
}