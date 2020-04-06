import { ModuleWithProviders, Injector, NgModule, PLATFORM_ID } from '@angular/core';
import { Routes, RouteReuseStrategy } from '@angular/router';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { CMS } from './cms';
import { CoreModule } from "./core.module";
import { setAppInjector } from './utils/appInjector';
import { OutsideZoneEventPlugin } from './utils/outside-zone-event-plugin';
import { CustomRouteReuseStrategy } from './utils/route-reuse-strategy';

import { LOCAL_STORAGE, localStorageFactory } from './services/browser-storage.service';

import { PAGE_TYPE_INDICATOR, BLOCK_TYPE_INDICATOR, MEDIA_TYPE_INDICATOR } from './decorators/metadata-key';
import { PROPERTY_PROVIDERS_TOKEN, getCmsPropertyFactory, CmsPropertyFactory } from './bases/cms-property.factory';
import { CmsProperty } from './bases/cms-property';
import { CmsPropertyRender } from "./render/property/property-render";

import { UIHint } from './types/ui-hint';
import { CmsModuleConfig } from './types/module-config';
import { ClassOf } from './types';

import { CmsContentRender } from './render/cms-content';
import { PROPERTY_PROVIDERS_RENDER_TOKEN, getCmsPropertyRenderFactory, CmsPropertyRenderFactory } from './render/property/property-render.factory';

import { ContentAreaRender } from './render/content-area/content-area';
import { TextRender, XHtmlRender, ImageRender, UrlRender, UrlListRender, ObjectListRender } from './render/property/property-render';


export const CMS_PROVIDERS = [
    {
        provide: EVENT_MANAGER_PLUGINS,
        useClass: OutsideZoneEventPlugin,
        multi: true
    },
    {
        provide: RouteReuseStrategy,
        useClass: CustomRouteReuseStrategy
    },
    {
        provide: LOCAL_STORAGE,
        useFactory: localStorageFactory,
        deps: [PLATFORM_ID]
    }
]

/**
 * Re-export Core Module to used on client
 */
@NgModule({ exports: [CoreModule] })
export class AngularCms {
    constructor(private injector: Injector) {
        setAppInjector(this.injector);
    }

    public static forRoot(): ModuleWithProviders<AngularCms> {
        this.registerPropertyRender(UIHint.ContentArea, ContentAreaRender)
        this.registerPropertyRender(UIHint.Text, TextRender)
        this.registerPropertyRender(UIHint.Textarea, TextRender)
        this.registerPropertyRender(UIHint.XHtml, XHtmlRender)
        this.registerPropertyRender(UIHint.Image, ImageRender);
        this.registerPropertyRender(UIHint.Url, UrlRender);
        this.registerPropertyRender(UIHint.UrlList, UrlListRender);
        this.registerPropertyRender(UIHint.ObjectList, ObjectListRender);

        return {
            ngModule: AngularCms,
            providers: [...CMS_PROVIDERS, ...CMS.PROPERTY_PROVIDERS]
        };
    }

    public static registerCmsRoutes(layoutComponent): Routes {
        const cmsRoutes: Routes = [
            {
                path: '',
                component: layoutComponent,
                children: [
                    {
                        path: '**',
                        data: { reuse: false }, //pass reuse param to CustomRouteReuseStrategy
                        component: CmsContentRender,
                    }
                ]
            }
        ];

        return cmsRoutes;
    }

    /**
     * Registers multi content types with cms
     * 
     * https://www.laurivan.com/scan-decorated-classes-in-typescript/
     * @param theEntryScope 
     */
    public static registerContentTypes(theEntryScope: any) {
        for (let prop in theEntryScope) {
            if (theEntryScope[prop][PAGE_TYPE_INDICATOR]) {
                CMS.PAGE_TYPES[prop] = theEntryScope[prop];
            }

            if (theEntryScope[prop][BLOCK_TYPE_INDICATOR]) {
                CMS.BLOCK_TYPES[prop] = theEntryScope[prop];
            }

            if (theEntryScope[prop][MEDIA_TYPE_INDICATOR]) {
                CMS.MEDIA_TYPES[prop] = theEntryScope[prop];
            }
        }
    }

    /**
     * Params angular cms
     * @param uniquePropertyUIHint The UIHint key such as Text, ContentArea...
     * @param property The property component to show ui in editor
     * @param [propertyFactory] 
     * @returns  
     */
    public static registerProperty(uniquePropertyUIHint: string, property: ClassOf<CmsProperty>, propertyFactory?: ClassOf<CmsPropertyFactory>) {
        if (!uniquePropertyUIHint || !property) return;

        if (CMS.PROPERTIES.hasOwnProperty(uniquePropertyUIHint)) {
            console.warn('Warning: CMS.PROPERTIES has already property ', uniquePropertyUIHint)
        }

        CMS.PROPERTIES[uniquePropertyUIHint] = property;

        if (propertyFactory) {
            CMS.PROPERTY_PROVIDERS.push({ provide: PROPERTY_PROVIDERS_TOKEN, useClass: propertyFactory, multi: true });
        } else {
            CMS.PROPERTY_PROVIDERS.push({ provide: PROPERTY_PROVIDERS_TOKEN, useFactory: getCmsPropertyFactory(uniquePropertyUIHint), deps: [Injector], multi: true });
        }
    }

    public static registerPropertyRender(uniquePropertyUIHint: string, property: ClassOf<CmsPropertyRender>, propertyRenderFactory?: ClassOf<CmsPropertyRenderFactory>) {
        if (!uniquePropertyUIHint || !property) return;

        if (CMS.PROPERTY_RENDERS.hasOwnProperty(uniquePropertyUIHint)) {
            console.warn('Warning: CMS.PROPERTY_RENDERS has already property ', uniquePropertyUIHint)
        }

        CMS.PROPERTY_RENDERS[uniquePropertyUIHint] = property;

        if (propertyRenderFactory) {
            CMS.PROPERTY_PROVIDERS.push({ provide: PROPERTY_PROVIDERS_RENDER_TOKEN, useClass: propertyRenderFactory, multi: true });
        } else {
            CMS.PROPERTY_PROVIDERS.push({ provide: PROPERTY_PROVIDERS_RENDER_TOKEN, useFactory: getCmsPropertyRenderFactory(uniquePropertyUIHint), deps: [Injector], multi: true });
        }
    }

    /**
     * Params angular cms
     * @param properties 
     */
    public static registerProperties(properties: Array<ClassOf<CmsProperty> | [string, ClassOf<CmsProperty>] | [string, ClassOf<CmsProperty>, ClassOf<CmsPropertyFactory>]>) {
        if (properties instanceof Array) {
            for (const property of properties) {
                if (property instanceof Function) {
                    this.registerProperty(UIHint.Text, property);
                }
                else if (property instanceof Array && property.length == 2) {
                    this.registerProperty(property[0], property[1]);
                }
                else if (property instanceof Array && property.length == 3) {
                    this.registerProperty(property[0], property[1], property[2]);
                }
            }
        }
    }

    /**
     * Registers module
     * @param moduleConfig 
     */
    public static registerModule(moduleConfig: CmsModuleConfig) {
        if (moduleConfig && moduleConfig.module && moduleConfig.roots) {
            let moduleName = moduleConfig.module['name'];

            var existingModule = CMS.MODULES.find(m => m.module['name'] === moduleName);
            if (existingModule) {
                console.warn(`The module ${moduleName} has already registered`);
            } else {
                CMS.MODULES.push(moduleConfig);
                CMS.NG_MODULES.push(moduleConfig.module);
            }
        }
    }
}