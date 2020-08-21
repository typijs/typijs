import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, Injector, ModuleWithProviders, NgModule, PLATFORM_ID } from '@angular/core';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { RouteReuseStrategy, Routes } from '@angular/router';

import { CMS } from './cms';
import { cmsInitializer, configDepsFactory, CONFIG_DEPS } from './cms.initializer';
import { CoreModule } from './core.module';
import { BLOCK_TYPE_INDICATOR, MEDIA_TYPE_INDICATOR, PAGE_TYPE_INDICATOR } from './decorators/metadata-key';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AuthService } from './auth/auth.service';
import { localStorageFactory, LOCAL_STORAGE } from './browser/browser-storage.service';
import { ConfigService } from './config/config.service';
import { CmsPageRender } from './renders/page-render';
import { DEFAULT_PROPERTY_RENDERS } from './renders/property-render.factory';
import { setAppInjector } from './utils/app-injector';
import { CustomRouteReuseStrategy } from './utils/route-reuse-strategy';
import { UndetectedEventPlugin } from './utils/undetected.event';
import { ContentAreaRenderFactory } from './renders/content-area/content-area';
import { TextRenderFactory, TextareaRenderFactory } from './renders/text/text-render';
import { XHtmlRenderFactory } from './renders/xhtml/xhtml-render';
import { ImageRenderFactory } from './renders/image/image-render';
import { UrlRenderFactory } from './renders/url/url-render';
import { UrlListRenderFactory } from './renders/url-list/url-list-render';
import { ObjectListRenderFactory } from './renders/object-list/object-list-render';

/**
 * Re-export Core Module to used on client
 */
@NgModule({ exports: [CoreModule] })
export class AngularCms {
    constructor(private injector: Injector) {
        setAppInjector(this.injector);
    }

    static forRoot(): ModuleWithProviders<AngularCms> {
        return {
            ngModule: AngularCms,
            providers: [
                { provide: APP_INITIALIZER, useFactory: cmsInitializer, deps: [ConfigService, CONFIG_DEPS], multi: true },
                { provide: CONFIG_DEPS, useFactory: configDepsFactory, deps: [AuthService, ConfigService] },
                { provide: LOCAL_STORAGE, useFactory: localStorageFactory, deps: [PLATFORM_ID] },
                { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
                { provide: EVENT_MANAGER_PLUGINS, useClass: UndetectedEventPlugin, multi: true },
                { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy },
                { provide: DEFAULT_PROPERTY_RENDERS, useClass: ContentAreaRenderFactory, multi: true },
                { provide: DEFAULT_PROPERTY_RENDERS, useClass: TextRenderFactory, multi: true },
                { provide: DEFAULT_PROPERTY_RENDERS, useClass: TextareaRenderFactory, multi: true },
                { provide: DEFAULT_PROPERTY_RENDERS, useClass: XHtmlRenderFactory, multi: true },
                { provide: DEFAULT_PROPERTY_RENDERS, useClass: ImageRenderFactory, multi: true },
                { provide: DEFAULT_PROPERTY_RENDERS, useClass: UrlRenderFactory, multi: true },
                { provide: DEFAULT_PROPERTY_RENDERS, useClass: UrlListRenderFactory, multi: true },
                { provide: DEFAULT_PROPERTY_RENDERS, useClass: ObjectListRenderFactory, multi: true }
            ]
        };
    }

    static registerCmsRoutes(layoutComponent): Routes {
        const cmsRoutes: Routes = [
            {
                path: '',
                component: layoutComponent,
                children: [
                    {
                        path: '**',
                        data: { reuse: false }, // pass reuse param to CustomRouteReuseStrategy
                        component: CmsPageRender,
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
