import { Component, Input, ComponentFactoryResolver, Inject, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SubjectService, ServiceLocator, Media, MediaService } from '@angular-cms/core';
import { TreeNode, TreeService, TreeConfig, NodeMenuItemAction, TreeComponent } from '../shared/tree';
import { MediaTreeService } from './media-tree.service';
import { UploadService } from './upload.service';

@Component({
    template: `
        <div dragOver>
            <div class="drop-zone" dragLeave>
                <file-upload (onFileChange)="fileChanged($event)"></file-upload>
            </div>
            <div class="nav-item nav-dropdown open media-container">
                <ul class="nav-dropdown-items">
                    <li class="nav-item">
                        <cms-tree 
                            class="tree-root" 
                            [root]="root"
                            [config]="treeConfig"
                            (nodeSelected)="folderSelected($event)"
                            (nodeInlineCreated)="createMediaFolder($event)">
                            <ng-template #treeNodeTemplate let-node>
                                <i class="fa fa-folder-o"></i>
                                <span>{{node.name}}</span>
                            </ng-template>
                        </cms-tree>
                    </li>
                </ul>
            </div>
            <div class="media-container list-group"  *ngIf="medias" #mediaItem>
                <div *ngFor="let media of medias" [draggable] [dragData]="media" class="list-group-item">
                    <img [src]='media["path"]'/>
                    {{media.name}}
                </div>
            </div>
            <div class="modal fade" tabindex="-1" role="dialog" [class.show]="showDialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">Modal title</h4>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" (click)="closeDialog()">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div *ngFor="let file of chooseFiles">
                            <progressbar *ngIf="progress" [value]="progress[file.name].progress | async"></progressbar>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" (click)="closeDialog()">Close</button>
                    </div>
                </div>
            </div>
        </div>
        </div>
        `,
    styles: [`
        .drop-zone {
            height: calc(100vh - 55px);
            position: relative;
            z-index:99;
            display: none;
            margin: -2px;
        }

        .drag-over .media-container{
            display: none;
        }

        .drag-over .drop-zone{
            display: block;
        }

        .show {
            display: block;
        }
  `]
})
export class MediaTreeComponent {
    showDialog: boolean = false;
    chooseFiles: Array<File>;
    progress: any;

    @ViewChild(TreeComponent) cmsTree: TreeComponent;
    medias: Array<Media>;

    root: TreeNode = new TreeNode({ id: '0', name: 'Media' });
    treeConfig: TreeConfig = {
        service: ServiceLocator.Instance.get(MediaTreeService),
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
        private mediaService: MediaService,
        private subjectService: SubjectService,
        private uploadService: UploadService) {
    }

    ngOnInit() {
        this.subjectService.blockFolderCreated$.subscribe(blockData => {
            //Todo: need to optimize only reload new node
            this.cmsTree.reloadNode(blockData._id);
        });
        this.folderSelected({ id: '0' });
    }

    folderSelected(node) {
        //load child block in folder
        this.mediaService.getFilesInFolder(node.id).subscribe(childBlocks => {
            this.medias = childBlocks;
            this.medias.forEach(x => {
                x["path"] = `/api/assets/${x._id}/${x.name}?w=50`;
            })
        })
    }

    createMediaFolder(node: TreeNode) {
        this.mediaService.addMediaFolder({ name: node.name, parentId: node.parentId })
            .subscribe(block => {
                this.subjectService.fireBlockCreated(block);
            });
    }

    openDiglog() {
        this.showDialog = true;
    }

    closeDialog() {
        this.showDialog = false;
    }

    fileChanged(chooseFiles) {
        this.chooseFiles = chooseFiles;
        this.showDialog = true;
        this.progress = this.uploadService.upload(chooseFiles);

        // convert the progress map into an array
        let allProgressObservables = [];
        for (let key in this.progress) {
            allProgressObservables.push(this.progress[key].progress);
        }


        // When all progress-observables are completed...
        // forkJoin(allProgressObservables).subscribe(end => {
        //     this.onUploadedFile.emit();
        // });
    }
}