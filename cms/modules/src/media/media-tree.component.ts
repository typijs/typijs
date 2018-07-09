import { Component, Input, ComponentFactoryResolver, Inject, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SubjectService, ServiceLocator, Media, MediaService } from '@angular-cms/core';
import { TreeNode, TreeService, TreeConfig, NodeMenuItemAction, TreeComponent } from '../shared/tree';
import { MediaTreeService } from './media-tree.service';

@Component({
    template: `
        <div class="nav-item nav-dropdown open">
            <a class="nav-link">
                <i class="fa fa-sitemap fa-fw"></i>
                Medias
            </a>
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
        <div>
            <div class="list-group" *ngIf="medias">
                <div *ngFor="let media of medias" [draggable] [dragData]="media"  class="list-group-item">
                    <img [src]='media["path"]'/>
                    {{media.name}}
                </div>
            </div>
        </div>
        `
})
export class MediaTreeComponent {
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
        private subjectService: SubjectService) {
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
            this.medias.forEach(x=>{
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
}