import { InjectionToken } from '@angular/core';
import { Routes } from '@angular/router';
import { CmsComponentConfig } from './types/module-config';

export const EDITOR_ROUTES: InjectionToken<Routes[]> = new InjectionToken<Routes[]>('EDITOR_ROUTES');
export const ADMIN_ROUTES: InjectionToken<Routes[]> = new InjectionToken<Routes[]>('ADMIN_ROUTES');
export const EDITOR_WIDGETS: InjectionToken<CmsComponentConfig[]> = new InjectionToken<CmsComponentConfig[]>('EDITOR_WIDGETS');
export const ADMIN_WIDGETS: InjectionToken<CmsComponentConfig[]> = new InjectionToken<CmsComponentConfig[]>('ADMIN_WIDGETS');

/**
 * The path from where user can access the portal. Default `/cms`
 */
export const ADMIN_ROUTE: InjectionToken<string> = new InjectionToken<string>('ADMIN_ROUTE');
/**
 * The path which point to the configuration file to fetch when init cms app. Default `/assets/config.json`
 */
export const CONFIG_PATH: InjectionToken<string> = new InjectionToken<string>('CONFIG_PATH');

export const APP_BASE_URL: InjectionToken<string> = new InjectionToken<string>('APP_BASE_URL');
