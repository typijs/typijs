import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { TreeStore } from './tree-store';
import { TreeNode } from './tree-node';
import { TreeService } from './tree-service';

@Component({
    selector: 'cms-tree',
    templateUrl: './tree.component.html',
    styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {
    @Input() treeService: TreeService;
    @Input() root: TreeNode;
    @Input() loadChildren: any;

    @Output()
    public nodeSelected: EventEmitter<any> = new EventEmitter();

    public children = [];
    private subscriptions: Subscription[] = [];


    constructor(private _store: TreeStore) {
    }

    ngOnInit() {
        if (this.treeService) {
            this._store.loadNodes(this.treeService.loadChildren, this.root.id);
        }

        this.subscriptions.push(this._store.getTreeNodes(this.root.id).subscribe(res => {
            this.children = res;
        }));

        this.subscriptions.push(this._store.nodeSelected$.subscribe(node => {
            this.nodeSelected.emit(node);
        }));
    }

    selectNode(node: TreeNode) {
        this._store.fireNodeSelected(node);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub && sub.unsubscribe());
    }
}
