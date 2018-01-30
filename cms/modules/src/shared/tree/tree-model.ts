import { TreeNode } from "./tree-node";
import { TreeService } from "./tree-service";
import { TreeMenu } from "./tree-menu";

export interface TreeModel {
    root: TreeNode;
    service: TreeService;
    menu?: TreeMenu;
}