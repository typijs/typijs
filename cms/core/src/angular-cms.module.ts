import { ModuleWithProviders } from '@angular/core';
import { RouteReuseStrategy, Routes } from '@angular/router';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { CoreModule } from "./core.module";
import { CmsRenderContentComponent } from './render';
import { OutsideZoneEventPlugin } from './utils/outside-zone-event-plugin';
import { CustomRouteReuseStrategy } from './utils/route-reuse-strategy';
import { CmsModuleConfig } from './constants/module-config';
import * as CMS from './cms';

// Reexport all pulic apis
export class AngularCmsModule extends CoreModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            providers: [
                {
                    provide: EVENT_MANAGER_PLUGINS,
                    useClass: OutsideZoneEventPlugin,
                    multi: true
                },
                {
                    provide: RouteReuseStrategy,
                    useClass: CustomRouteReuseStrategy
                }
            ]
        };
    }

    public static registerCmsRoutes(layoutComponent): Routes {
        // fix for issue "Cannot read property 'loadchildren' of undefined in angular 5"
        // The weired fixing way in https://github.com/angular/angular/issues/22700 
        return [
            {
                path: 'cms',
                loadChildren: '@angular-cms/portal/src/cms.module#CmsModule',
            },
            {
                path: '',
                component: layoutComponent,
                children: [
                    {
                        path: '**',
                        data: { reuse: false },
                        component: CmsRenderContentComponent,
                    }
                ]
            }
        ];

        // const cmsRoutes: Routes = [
        //     {
        //         path: 'cms',
        //         loadChildren: '@angular-cms/portal/src/cms.module#CmsModule',
        //     },
        //     {
        //         path: '',
        //         component: layoutComponent,
        //         children: [
        //             {
        //                 path: '**',
        //                 data: { reuse: false },
        //                 component: CmsRenderContentComponent,
        //             }
        //         ]
        //     }
        // ];

        // return cmsRoutes;
    }

    public static registerContentTypes(theEntryScope: any) {
        CMS.registerContentTypes(theEntryScope);
    }

    public static registerProperty(property: any, uniqueAccessKey?: string) {
        CMS.registerProperty(property, uniqueAccessKey);
    }

    public static registerProperties(properties: Array<[string, Function]> | Array<Function>) {
        CMS.registerProperties(properties);
    }

    public static registerModule(moduleConfig: CmsModuleConfig) {
        CMS.registerModule(moduleConfig);
    }
}