import { Component, Input, ChangeDetectionStrategy, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ContentService } from '@angular-cms/core';
import { TreeNode } from '../content-tree/tree-node';

@Component({
    templateUrl: './editor-layout.component.html',
    styleUrls: ['./editor-layout.component.scss']
})
export class EditorLayoutComponent implements OnInit {

    root: TreeNode = null;

    ngOnInit() {
        this.root = new TreeNode('000000000000000000000000', "abc", "");
    }
}
