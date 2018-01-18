
import { Routes } from '@angular/router';

export enum CmsRootModule {
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
    group: string
}

export interface CmsModuleConfig {
    root: CmsRootModule,
    module: any,
    routes?: Routes,
    widgets?: CmsComponentConfig[]
}

