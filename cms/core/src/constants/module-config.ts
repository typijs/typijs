
import { Routes } from '@angular/router';

export enum CmsModuleRoot {
    Editor = "Editor",
    Admin = "Admin"
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
}

export type CmsRootConfig = {
    name: CmsModuleRoot,
    routes?: Routes,
    widgets?: CmsComponentConfig[]
}

export type CmsModuleConfig = {
    module: any,
    roots: Array<CmsRootConfig>
}

export type CmsTab = {
    title: string,
    content: string
}

