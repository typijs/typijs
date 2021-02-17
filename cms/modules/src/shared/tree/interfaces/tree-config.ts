import { TemplateRef } from '@angular/core';
import { TreeMenuItem } from './tree-menu';

export type TreeConfig = {
    shouldShowRootNode?: boolean;
    menuItems?: TreeMenuItem[];
};

export type TreeNodeTemplate = {
    loadingTemplate: TemplateRef<any>;
    treeNodeTemplate: TemplateRef<any>;
};
