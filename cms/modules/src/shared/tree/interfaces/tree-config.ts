import { TreeMenuItem } from "./tree-menu";
import { TemplateRef } from '@angular/core';

export type TreeConfig = {
    shouldShowRootNode?: boolean;
    menuItems?: TreeMenuItem[];
}

export type TreeNodeTemplate = {
    loadingTemplate: TemplateRef<any>;
    treeNodeTemplate: TemplateRef<any>;
}