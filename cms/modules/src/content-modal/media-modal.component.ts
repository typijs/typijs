import { CmsImage, ContentReference, FOLDER_MEDIA, LanguageService, Media, MediaService, MEDIA_TYPE, VersionStatus } from '@angular-cms/core';
import { Component, EventEmitter, Injectable, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { TreeComponent } from '../shared/tree/components/tree.component';
import { TreeNode } from '../shared/tree/interfaces/tree-node';
import { TreeService } from '../shared/tree/interfaces/tree-service';

@Injectable()
export class MediaTreeReadonlyService implements TreeService {
    constructor(protected mediaService: MediaService, protected languageService: LanguageService) { }

    getNode(nodeId: string): Observable<TreeNode> {
        return this.mediaService.getContent(nodeId, this.languageService.EMPTY_LANGUAGE).pipe(
            map(media => TreeNode.createInstanceFromContent(media, FOLDER_MEDIA)));
    }

    loadChildren(parentNodeId: string): Observable<TreeNode[]> {
        return this.mediaService.getFolderChildren(parentNodeId).pipe(
            map((childFolders: Media[]) => {
                return childFolders.map(folder => TreeNode.createInstanceFromContent(folder, FOLDER_MEDIA));
            }));
    }
}

@Component({
    selector: 'media-list',
    template: `
    <div class="list-group list-media"  *ngIf="medias">
        <a *ngFor="let media of medias"
            href="javascript:void(0)"
            (click)="mediaSelect.emit(media)"
            class="list-group-item list-group-item-action p-2">
            <div class="d-flex align-items-center">
                <img width='50' class="mr-1" [src]='media.thumbnail | toImgSrc'/>
                <div class="w-100 mr-2 text-truncate">{{media.name}}</div>
            </div>
        </a>
    </div>
    `
})
export class MediaListComponent {
    @Input() medias: Media[];
    @Output() mediaSelect: EventEmitter<Media> = new EventEmitter();
}

@Component({
    selector: 'media-tree-modal',
    template: `
    <cms-modal
        [title]="'Select the file'"
        [okButtonText]="'Select'"
        [disableOkButton]="!selectedContent"
        (ok)="onConfirmSelect()">
        <div class="d-flex h-100 media-tree p-2">
            <div class='w-50 h-100 overflow-auto'>
                <cms-tree
                    class="tree-root pl-1 pt-2 d-block"
                    [root]="root"
                    (nodeSelected)="folderSelected$.next($event)">
                    <ng-template #treeNodeTemplate let-node>
                        <fa-icon class="mr-1" *ngIf="node.id == 0" icon="photo-video"></fa-icon>
                        <fa-icon class="mr-1" *ngIf="node.id != 0" icon="folder"></fa-icon>
                        <span>{{node.name}}</span>
                    </ng-template>
                </cms-tree>
            </div>
            <div class='w-50 h-100 overflow-auto'>
                <media-list [medias]="medias$ | async" (mediaSelect)="onMediaSelected($event)"></media-list>
            </div>
        </div>
    </cms-modal>
    `,
    styles: [`
        .media-tree {
            height: 450px;
        }
  `],
    providers: [MediaTreeReadonlyService, { provide: TreeService, useExisting: MediaTreeReadonlyService }]
})
export class MediaTreeModalComponent implements OnInit {
    @ViewChild(TreeComponent, { static: true }) cmsTree: TreeComponent;

    @Input() selectedContentId: string;

    root: TreeNode;
    selectedContent: CmsImage & ContentReference;
    medias$: Observable<Media[]>;
    folderSelected$: ReplaySubject<Partial<TreeNode>> = new ReplaySubject(1);
    private selectedContentSubject: ReplaySubject<CmsImage & ContentReference> = new ReplaySubject(1);

    constructor(private treeService: TreeService, private mediaService: MediaService) {
        this.root = new TreeNode({ id: '0', name: 'Medias' });
    }

    ngOnInit(): void {
        if (this.selectedContentId) {
            this.treeService.getNode(this.selectedContentId).pipe(
                switchMap(node => this.treeService.getNode(node.parentId))
            ).subscribe(node => {
                this.cmsTree.expandTreeToSelectedNode(node);
                this.folderSelected$.next(node);
            })
        } else {
            this.folderSelected$.next(this.root);
        }

        this.medias$ = this.folderSelected$.pipe(
            switchMap(node => this.mediaService.getContentInFolder(node.id)),
            map((medias: Media[]) => medias.map(media => Object.assign(media, {
                type: MEDIA_TYPE,
                contentType: media.contentType,
                isPublished: media.status === VersionStatus.Published
            })))
        );
    }

    onMediaSelected(media: Media) {
        this.selectedContent = <CmsImage & ContentReference>{
            contentType: media.contentType,
            id: media._id,
            type: MEDIA_TYPE,
            name: media.name,
            src: media.linkUrl,
            alt: media.name,
            thumbnail: media.thumbnail
        };
    }

    onConfirmSelect(): void {
        this.selectedContentSubject.next(this.selectedContent);
    }

    getResult(): Observable<ContentReference> {
        return this.selectedContentSubject.asObservable().pipe(take(1));
    }
}
