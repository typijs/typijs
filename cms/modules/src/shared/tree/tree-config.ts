import { TreeService } from "./tree-service";
import { TreeMenuItem } from "./tree-menu";

export interface TreeConfig {
    shouldShowRootNode?: boolean;
    service: TreeService;
    menuItems?: TreeMenuItem[];
}