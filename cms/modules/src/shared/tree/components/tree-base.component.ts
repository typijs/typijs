import { Output, EventEmitter } from '@angular/core';

import { TreeNode } from '../interfaces/tree-node';
import { NodeMenuItemAction } from '../interfaces/tree-menu';
import { SubscriptionDestroy } from '../../subscription-destroy';

export abstract class TreeBaseComponent extends SubscriptionDestroy {
    @Output("selectNode") selectNodeEvent: EventEmitter<TreeNode> = new EventEmitter();
    @Output("nodeOnBlur") nodeOnBlurEvent: EventEmitter<TreeNode> = new EventEmitter();
    @Output("submitInlineNode") submitInlineNodeEvent: EventEmitter<TreeNode> = new EventEmitter();
    @Output("cancelInlineNode") cancelInlineNodeEvent: EventEmitter<TreeNode> = new EventEmitter();
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

    submitInlineNode(node: TreeNode) {
        this.submitInlineNodeEvent.emit(node);
    }

    cancelInlineNode(node: TreeNode) {
        this.cancelInlineNodeEvent.emit(node);
    }
}