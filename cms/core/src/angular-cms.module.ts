import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, Injector, ModuleWithProviders, NgModule, PLATFORM_ID } from '@angular/core';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { RouteReuseStrategy, Routes } from '@angular/router';
import { CmsProperty } from './bases/cms-property';
import { CmsPropertyFactory, PROPERTY_PROVIDERS_TOKEN } from './bases/cms-property.factory';
import { CMS } from './cms';
import { cmsInitializer, CONFIG_DEPS, configDepsFactory } from './cms.initializer';
import { CoreModule } from "./core.module";
import { BLOCK_TYPE_INDICATOR, MEDIA_TYPE_INDICATOR, PAGE_TYPE_INDICATOR } from './decorators/metadata-key';
import { AuthService } from './infrastructure/auth/auth.service';
import { AuthInterceptor } from './infrastructure/auth/auth.interceptor';
import { localStorageFactory, LOCAL_STORAGE } from './infrastructure/browser/browser-storage.service';
import { ConfigService } from './infrastructure/config/config.service';
import { CmsContentRender } from './infrastructure/rendering/cms-content';
import { ContentAreaRender } from './infrastructure/rendering/content-area/content-area';
import { CmsPropertyRender, ImageRender, ObjectListRender, TextRender, UrlListRender, UrlRender, XHtmlRender } from './infrastructure/rendering/property/property-render';
import { CmsPropertyRenderFactory, getCmsPropertyRenderFactory, PROPERTY_PROVIDERS_RENDER_TOKEN, contentAreaRenderFactory, textRenderFactory, textareaRenderFactory, xhtmlRenderFactory, imageRenderFactory, urlRenderFactory, urlListRenderFactory, objectListRenderFactory } from './infrastructure/rendering/property/property-render.factory';
import { ClassOf } from './types';
import { CmsModuleConfig } from './types/module-config';
import { UIHint } from './types/ui-hint';
import { setAppInjector } from './utils/appInjector';
import { CustomRouteReuseStrategy } from './utils/route-reuse-strategy';
import { UndetectedEventPlugin } from './utils/undetected.event';

/**
 * Re-export Core Module to used on client
 */
@NgModule({ exports: [CoreModule] })
export class AngularCms {
    constructor(private injector: Injector) {
        setAppInjector(this.injector);
    }

    public static forRoot(): ModuleWithProviders<AngularCms> {
        return {
            ngModule: AngularCms,
            providers: [
                { provide: APP_INITIALIZER, useFactory: cmsInitializer, deps: [ConfigService, CONFIG_DEPS], multi: true },
                { provide: CONFIG_DEPS, useFactory: configDepsFactory, deps: [AuthService, ConfigService] },
                { provide: LOCAL_STORAGE, useFactory: localStorageFactory, deps: [PLATFORM_ID] },
                { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
                { provide: EVENT_MANAGER_PLUGINS, useClass: UndetectedEventPlugin, multi: true },
                { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy },
                { provide: PROPERTY_PROVIDERS_RENDER_TOKEN, useFactory: contentAreaRenderFactory, deps: [Injector], multi: true },
                { provide: PROPERTY_PROVIDERS_RENDER_TOKEN, useFactory: textRenderFactory, deps: [Injector], multi: true },
                { provide: PROPERTY_PROVIDERS_RENDER_TOKEN, useFactory: textareaRenderFactory, deps: [Injector], multi: true },
                { provide: PROPERTY_PROVIDERS_RENDER_TOKEN, useFactory: xhtmlRenderFactory, deps: [Injector], multi: true },
                { provide: PROPERTY_PROVIDERS_RENDER_TOKEN, useFactory: imageRenderFactory, deps: [Injector], multi: true },
                { provide: PROPERTY_PROVIDERS_RENDER_TOKEN, useFactory: urlRenderFactory, deps: [Injector], multi: true },
                { provide: PROPERTY_PROVIDERS_RENDER_TOKEN, useFactory: urlListRenderFactory, deps: [Injector], multi: true },
                { provide: PROPERTY_PROVIDERS_RENDER_TOKEN, useFactory: objectListRenderFactory, deps: [Injector], multi: true },
                //Not working on SSR mode and AOT
                //https://www.bennadel.com/blog/3565-providing-module-configuration-using-forroot-and-ahead-of-time-compiling-in-angular-7-2-0.htm
                ...CMS.PROPERTY_PROVIDERS
            ]
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
            //CMS.PROPERTY_PROVIDERS.push({ provide: PROPERTY_PROVIDERS_TOKEN, useFactory: getCmsPropertyFactory(uniquePropertyUIHint), deps: [Injector], multi: true });
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

    private static registerPropertyRenders() {
        this.registerPropertyRender(UIHint.ContentArea, ContentAreaRender)
        this.registerPropertyRender(UIHint.Text, TextRender)
        this.registerPropertyRender(UIHint.Textarea, TextRender)
        this.registerPropertyRender(UIHint.XHtml, XHtmlRender)
        this.registerPropertyRender(UIHint.Image, ImageRender);
        this.registerPropertyRender(UIHint.Url, UrlRender);
        this.registerPropertyRender(UIHint.UrlList, UrlListRender);
        this.registerPropertyRender(UIHint.ObjectList, ObjectListRender);
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
            const moduleName = moduleConfig.module['name'];

            const existingModule = CMS.MODULES.find(m => m.module['name'] === moduleName);
            if (existingModule) {
                console.warn(`The module ${moduleName} has already registered`);
            } else {
                CMS.MODULES.push(moduleConfig);
                CMS.NG_MODULES.push(moduleConfig.module);
            }
        }
    }
}