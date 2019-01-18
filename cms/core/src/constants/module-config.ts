
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

export interface CmsComponentConfig {
    component: any,
    position: CmsWidgetPosition,
    group?: string
}

export interface CmsModuleConfig {
    root: CmsModuleRoot,
    module: any,
    routes?: Routes,
    widgets?: CmsComponentConfig[]
}

export interface CmsTab {
    title: string,
    content: string
}

