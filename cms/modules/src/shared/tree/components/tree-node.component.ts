import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { TreeConfig } from '../interfaces/tree-config';
import { NodeMenuItemAction, TreeMenuItem } from '../interfaces/tree-menu';
import { TreeNode } from '../interfaces/tree-node';
import { TreeStore } from '../tree-store';
import { TreeBaseComponent } from './tree-base.component';

@Component({
    selector: 'tree-node',
    templateUrl: './tree-node.component.html',
})
export class TreeNodeComponent extends TreeBaseComponent implements OnInit {
    // https://netbasal.com/autofocus-that-works-anytime-in-angular-apps-68cb89a3f057
    @ViewChild('nodeInlineInput', { static: false })
    set nodeInlineInput(element: ElementRef<HTMLInputElement>) {
        if (element) {
            element.nativeElement.focus()
        }
    }

    @Input() node: TreeNode;
    @Input() config: TreeConfig;
    @Input() templates: any = {};

    menuItems: TreeMenuItem[];
    nodeName: string;
    private blurTimer: any;

    constructor(
        private treeStore: TreeStore,
        private hostElement: ElementRef<HTMLElement>) {
        super();
    }

    ngOnInit() {
        this.treeStore.scrollToSelectedNode$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((scrollToNode: TreeNode) => {
                if (scrollToNode.id == this.node.id) { this.scrollIntoNode(); }
            });

        if (this.config) { this.menuItems = this.config.menuItems; }
        if (this.node) { this.nodeName = this.node.name; }
    }

    nodeOnBlur(node: TreeNode) {
        this.blurTimer = setTimeout(() => {
            if (this.nodeName) {
                this.submitInlineNode(node);
            } else {
                this.cancelInlineNode(node);
            }
        }, 200);
    }

    submitInlineNode(node: TreeNode) {
        if (this.blurTimer) clearTimeout(this.blurTimer);

        const newName = this.nodeName ? this.nodeName.trim() : null;
        if (newName && newName !== node.name) {
            node.name = newName;
            this.submitInlineNodeEvent.emit(node);
        } else {
            this.cancelInlineNode(node);
        }
    }

    cancelInlineNode(node: TreeNode) {
        if (this.blurTimer) clearTimeout(this.blurTimer);

        this.nodeName = node.name;
        this.cancelInlineNodeEvent.emit({ parentNode: null, node });
    }

    private scrollIntoNode() {
        // scroll to middle of viewport
        this.hostElement.nativeElement.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center'
        });
    }

    onMenuItemSelected(action: NodeMenuItemAction, node: TreeNode) {
        this.menuItemSelected({ action, node });
    }

    onMenuOpenChange(isOpened: boolean, node: TreeNode): void {
        const selectedNode = this.treeStore.getSelectedNode();
        if (!selectedNode || selectedNode.id != node.id) {
            node.isSelected = isOpened;
        }
    }
}
