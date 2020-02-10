import { Output, EventEmitter } from '@angular/core';

import { TreeNode } from '../interfaces/tree-node';
import { NodeMenuItemAction } from '../interfaces/tree-menu';
import { SubscriptionComponent } from '../../subscription.component';

export abstract class TreeBaseComponent extends SubscriptionComponent {
    @Output("selectNode") selectNodeEvent: EventEmitter<TreeNode> = new EventEmitter();
    @Output("nodeOnBlur") nodeOnBlurEvent: EventEmitter<TreeNode> = new EventEmitter();
    @Output("createNewInlineNode") createNewInlineNodeEvent: EventEmitter<TreeNode> = new EventEmitter();
    @Output("cancelNewInlineNode") cancelNewInlineNodeEvent: EventEmitter<TreeNode> = new EventEmitter();
    @Output("menuItemSelected") menuItemSelectedEvent: EventEmitter<{ action: NodeMenuItemAction, node: TreeNode }> = new EventEmitter();

    selectNode(node: TreeNode) {
        this.selectNodeEvent.emit(node);
    }

    nodeOnBlur(node: TreeNode) {
        this.nodeOnBlurEvent.emit(node);
    }

    menuItemSelected(nodeAction: { action: NodeMenuItemAction, node: TreeNode }) {
        this.menuItemSelectedEvent.emit(nodeAction)
    }

    createNewInlineNode(node: TreeNode) {
        this.createNewInlineNodeEvent.emit(node);
    }

    cancelNewInlineNode(node: TreeNode) {
        this.cancelNewInlineNodeEvent.emit(node);
    }
}