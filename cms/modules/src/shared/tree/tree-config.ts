import { TreeNode } from "./tree-node";
import { TreeService } from "./tree-service";
import { TreeMenuItem } from "./tree-menu";

export interface TreeConfig {
    service: TreeService;
    menuItems?: TreeMenuItem[];
}