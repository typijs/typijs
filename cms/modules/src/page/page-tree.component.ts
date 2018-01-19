import { Component, Input, ComponentFactoryResolver, Inject, ViewChild, OnDestroy } from '@angular/core';
import { TreeNode } from '../shared/content-tree/tree-node';

@Component({
    template: `
        <a href="javascript:void(0)">
            <i class="fa fa-sitemap fa-fw"></i> Pages
            <span class="fa fa-plus pull-right" [routerLink]="['new/page']"></span>
        </a>
        <ul class="nav nav-second-level tree">
            <content-tree [root]="root"></content-tree>
        </ul>`
})
export class PageTreeComponent {

    root: TreeNode = null;

    ngOnInit() {
        this.root = new TreeNode('000000000000000000000000', "abc", "");
    }
}