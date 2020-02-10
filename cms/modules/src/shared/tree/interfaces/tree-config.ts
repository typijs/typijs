import { TreeService } from "./tree-service";
import { TreeMenuItem } from "./tree-menu";
import { TemplateRef } from '@angular/core';

export interface TreeConfig {
    shouldShowRootNode?: boolean;
    service: TreeService;
    menuItems?: TreeMenuItem[];
}

export interface TreeNodeTemplate {
    loadingTemplate: TemplateRef<any>,
    treeNodeTemplate: TemplateRef<any>
}