import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { TreeStore } from './tree-store';
import { TreeNode } from './tree-node';
import { TreeService } from './tree-service';
import { TreeModel } from './tree-model';

@Component({
    selector: 'cms-tree',
    templateUrl: './tree.component.html',
    styleUrls: ['./tree.component.scss'],
    providers: [TreeStore]
})
export class TreeComponent implements OnInit {
    @Input() tree: TreeModel;

    @Output()
    public nodeSelected: EventEmitter<any> = new EventEmitter();

    public children = [];

    private treeService: TreeService;
    private root: TreeNode;
    private subscriptions: Subscription[] = [];

    constructor(private _store: TreeStore) {}

    ngOnInit() {
        if(this.tree) {
            this.treeService = this.tree.service;
            this.root = this.tree.root;
            if (this.treeService) {
                this._store.loadNodes(this.treeService.loadChildren, this.root.id);
            }
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
