import { Routes } from '@angular/router';

import { CmsObject } from './types';
import { CmsComponentConfig } from './types/module-config';
import { InjectionToken } from '@angular/core';

export const EDITOR_ROUTES: InjectionToken<Routes[]> = new InjectionToken<Routes[]>('CMS_EDITOR_ROUTES');
export const ADMIN_ROUTES: InjectionToken<Routes[]> = new InjectionToken<Routes[]>('CMS_ADMIN_ROUTES');
export const EDITOR_WIDGETS: InjectionToken<Routes[]> = new InjectionToken<CmsComponentConfig[][]>('CMS_EDITOR_WIDGETS');
export const ADMIN_WIDGETS: InjectionToken<Routes[]> = new InjectionToken<CmsComponentConfig[][]>('CMS_ADMIN_WIDGETS');

/**
 * The type of global CMS model. It keeps all cms configurations
 */
export type CmsModel = {
    /**
     * This property keeps all Page Types class was registered via decorator `@PageType`
     */
    PAGE_TYPES: CmsObject;
    /**
     * This property keeps all Block Types class was registered via decorator `@BlockType`
     */
    BLOCK_TYPES: CmsObject;
    /**
     * This property keeps all Media Types class was registered via decorator `@MediaType`
     */
    MEDIA_TYPES: CmsObject;
}

export const CMS: CmsModel = {
    PAGE_TYPES: {},
    BLOCK_TYPES: {},
    MEDIA_TYPES: {}
}