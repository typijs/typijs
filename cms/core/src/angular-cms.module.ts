import { ModuleWithProviders, Injector, NgModule } from '@angular/core';
import { Routes } from '@angular/router';

import { PAGE_TYPE_INDICATOR, BLOCK_TYPE_INDICATOR, MEDIA_TYPE_INDICATOR } from './decorators/metadata-key';
import { PROPERTY_PROVIDERS_TOKEN, getCmsPropertyFactory, CmsPropertyFactory } from './bases/cms-property.factory';
import { CmsModuleConfig, ClassOf } from './constants/types';
import { UIHint } from './constants/ui-hint';
import { CmsRenderContentComponent } from './render/cms-content';
import { setAppInjector } from './utils/appInjector';
import { CoreModule, CMS_PROVIDERS } from "./core.module";
import { CMS } from './cms';
import { CmsProperty, CmsPropertyRender } from './bases/cms-property';
import { CmsPropertyRenderFactory, PROPERTY_PROVIDERS_RENDER_TOKEN, getCmsPropertyRenderFactory } from './factories/property-render.factory';

/**
 * Re-export Core Module to used on client
 */
@NgModule({ imports: [CoreModule] })
export class AngularCms {
    constructor(private injector: Injector) {
        setAppInjector(this.injector);
    }

    public static forRoot(): ModuleWithProviders<AngularCms> {
        return {
            ngModule: AngularCms,
            providers: [...CMS_PROVIDERS]
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