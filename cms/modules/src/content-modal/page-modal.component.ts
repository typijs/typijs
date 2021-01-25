import { ContentReference, LanguageService, Page, PageService, PAGE_TYPE } from '@angular-cms/core';
import { Component, Injectable, Input, OnInit, ViewChild } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { TreeComponent } from '../shared/tree/components/tree.component';
import { TreeNode } from '../shared/tree/interfaces/tree-node';
import { TreeService } from '../shared/tree/interfaces/tree-service';

@Injectable()
export class PageTreeReadonlyService implements TreeService {

    constructor(private pageService: PageService, private languageService: LanguageService) { }

    getNode(nodeId: string): Observable<TreeNode> {
        const language = this.languageService.getLanguageParam();
        return this.pageService.getContent(nodeId, language).pipe(
            map(page => TreeNode.createInstanceFromContent(page, PAGE_TYPE)));
    }

    loadChildren(parentNodeId: string): Observable<TreeNode[]> {
        return this.pageService.getContentChildren(parentNodeId).pipe(
            map((childPages: Page[]) => {
                return childPages.map(page => TreeNode.createInstanceFromContent(page, PAGE_TYPE));
            }));
    }
}

@Component({
    selector: 'page-tree-modal',
    template: `
    <cms-modal
        [title]="'Select the page'"
        [okButtonText]="'Select'"
        [disableOkButton]="!selectedContent"
        (ok)="onConfirmSelect()">
        <div class='position-relative page-tree overflow-auto p-2'>
            <cms-tree
                class="tree-root pl-1 pt-2 d-block"
                [root]="root"
                (nodeSelected)="onContentSelected($event)">
                <ng-template #treeNodeTemplate let-node>
                    <fa-icon class="mr-1" *ngIf="node.id == '0'" icon="sitemap"></fa-icon>
                    <fa-icon class="mr-1" *ngIf="node.id != '0'" icon="file"></fa-icon>
                    <span>{{node.name}}</span>
                </ng-template>
            </cms-tree>
        </div>
    </cms-modal>
    `,
    styles: [`
        .page-tree {
            height: 450px;
        }
  `],
    providers: [PageTreeReadonlyService, { provide: TreeService, useExisting: PageTreeReadonlyService }]
})
export class PageTreeModalComponent implements OnInit {
    @ViewChild(TreeComponent, { static: true }) cmsTree: TreeComponent;

    @Input() selectedContentId: string;
    @Input() allowTypes: string[];

    root: TreeNode;
    selectedContent: ContentReference;
    private selectedContentSubject: ReplaySubject<ContentReference> = new ReplaySubject(1);

    constructor(private treeService: TreeService) {
        this.root = new TreeNode({ id: '0', name: 'Pages' });
    }

    ngOnInit(): void {
        if (this.selectedContentId) {
            this.treeService.getNode(this.selectedContentId).subscribe(node => {
                this.cmsTree.expandTreeToSelectedNode(node);
            })
        }
    }

    onContentSelected(node: TreeNode) {
        this.selectedContent = <ContentReference>{
            contentType: node.contentType,
            id: node.id,
            type: node.type,
            name: node.name
        };
    }

    onConfirmSelect(): void {
        this.selectedContentSubject.next(this.selectedContent);
    }

    getResult(): Observable<ContentReference> {
        return this.selectedContentSubject.asObservable().pipe(take(1));
    }
}
