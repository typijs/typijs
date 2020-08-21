import { Routes } from '@angular/router';
import { CmsObject } from './index';

export enum CmsModuleRoot {
    Editor = 'Editor',
    Admin = 'Admin'
}

export enum CmsWidgetPosition {
    Top,
    Left,
    Right
}

export type CmsComponentConfig = {
    component: any,
    position: CmsWidgetPosition,
    group?: string
};

export type CmsRootConfig = {
    name: CmsModuleRoot,
    routes?: Routes,
    widgets?: CmsComponentConfig[]
};

export type CmsModuleConfig = {
    module: CmsObject,
    roots: CmsRootConfig[],
};
