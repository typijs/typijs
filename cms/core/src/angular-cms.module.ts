import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, Injector, ModuleWithProviders, NgModule, PLATFORM_ID } from '@angular/core';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { RouteReuseStrategy, Routes } from '@angular/router';

import { CMS } from './cms';
import { cmsInitializer, configDepsFactory, CONFIG_DEPS } from './cms.initializer';
import { CoreModule } from "./core.module";
import { BLOCK_TYPE_INDICATOR, MEDIA_TYPE_INDICATOR, PAGE_TYPE_INDICATOR } from './decorators/metadata-key';
import { AuthInterceptor } from './infrastructure/auth/auth.interceptor';
import { AuthService } from './infrastructure/auth/auth.service';
import { localStorageFactory, LOCAL_STORAGE } from './infrastructure/browser/browser-storage.service';
import { ConfigService } from './infrastructure/config/config.service';
import { CmsContentRender } from './infrastructure/rendering/cms-content';
import { ContentAreaRenderFactory, ImageRenderFactory, ObjectListRenderFactory, PROPERTY_RENDERS, TextareaRenderFactory, TextRenderFactory, UrlListRenderFactory, UrlRenderFactory, XHtmlRenderFactory } from './infrastructure/rendering/property/property-render.factory';
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
                { provide: PROPERTY_RENDERS, useClass: ContentAreaRenderFactory, multi: true },
                { provide: PROPERTY_RENDERS, useClass: TextRenderFactory, multi: true },
                { provide: PROPERTY_RENDERS, useClass: TextareaRenderFactory, multi: true },
                { provide: PROPERTY_RENDERS, useClass: XHtmlRenderFactory, multi: true },
                { provide: PROPERTY_RENDERS, useClass: ImageRenderFactory, multi: true },
                { provide: PROPERTY_RENDERS, useClass: UrlRenderFactory, multi: true },
                { provide: PROPERTY_RENDERS, useClass: UrlListRenderFactory, multi: true },
                { provide: PROPERTY_RENDERS, useClass: ObjectListRenderFactory, multi: true },
                //Not working on SSR mode and AOT
                //https://www.bennadel.com/blog/3565-providing-module-configuration-using-forroot-and-ahead-of-time-compiling-in-angular-7-2-0.htm
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
}