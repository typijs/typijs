import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { TreeStore } from './tree-store';
import { TreeNode } from './tree-node';

@Component({
    selector: 'content-tree',
    templateUrl: './content-tree.component.html',
    styleUrls: ['./content-tree.component.scss']
})
export class ContentTreeComponent implements OnInit {
    @Input() root: TreeNode;
    children: any;
    items = [];
    subscription;

    constructor(private _store: TreeStore) {
    }

    ngOnInit() {
        this.subscription = this._store.getTreeNodes(this.root.key).subscribe(res => {
            this.items = res;
        });
        this._store.loadNodes(this.root.key);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
