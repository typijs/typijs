import { ModuleWithProviders, PLATFORM_ID } from '@angular/core';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { RouteReuseStrategy, Routes } from '@angular/router';
import { PAGE_TYPE_INDICATOR, BLOCK_TYPE_INDICATOR } from './constants/meta-keys';
import { CMS } from './cms';
import { ComponentFactoryResolver } from '@angular/core';

import { CmsModuleConfig } from './constants/module-config';
import { CoreModule } from "./core.module";
import { CmsRenderContentComponent } from './render/cms-content';
import { localStorageFactory, LOCAL_STORAGE } from './services/browser-storage.service';
import { OutsideZoneEventPlugin } from './utils/outside-zone-event-plugin';
import { CustomRouteReuseStrategy } from './utils/route-reuse-strategy';
import { PROPERTY_PROVIDERS_TOKEN, getCmsPropertyFactory } from './bases/cms-property';

// Reexport all public apis
export class AngularCmsModule {
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
                },
                {
                    provide: LOCAL_STORAGE,
                    useFactory: localStorageFactory,
                    deps: [PLATFORM_ID]
                }
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
                        component: CmsRenderContentComponent,
                    }
                ]
            }
        ];

        return cmsRoutes;
    }

    //register multi content types with cms
    //https://www.laurivan.com/scan-decorated-classes-in-typescript/
    public static registerContentTypes(theEntryScope: any) {
        for (let prop in theEntryScope) {
            if (theEntryScope[prop][PAGE_TYPE_INDICATOR]) {
                CMS.PAGE_TYPES[prop] = theEntryScope[prop];
            }

            if (theEntryScope[prop][BLOCK_TYPE_INDICATOR]) {
                CMS.BLOCK_TYPES[prop] = theEntryScope[prop];
            }
        }
    }

    public static registerProperty(uniquePropertyKey: string, property: Function, propertyProvider?: Function) {
        if (!uniquePropertyKey || !property) return;

        if (CMS.PROPERTIES.hasOwnProperty(uniquePropertyKey)) {
            console.warn('Warning: CMS.PROPERTIES has already property ', uniquePropertyKey)
        }

        CMS.PROPERTIES[uniquePropertyKey] = property;

        if (propertyProvider) {
            CMS.PROPERTY_PROVIDERS.push({ provide: PROPERTY_PROVIDERS_TOKEN, useClass: propertyProvider, multi: true });
        } else {
            CMS.PROPERTY_PROVIDERS.push({ provide: PROPERTY_PROVIDERS_TOKEN, useFactory: getCmsPropertyFactory(uniquePropertyKey), deps: [ComponentFactoryResolver], multi: true });
        }
    }

    public static registerProperties(properties: Array<Function> | Array<[string, Function] | [string, Function, Function]>) {
        if (properties instanceof Array) {
            for (const property of properties) {
                if (property instanceof Function) {
                    this.registerProperty(property['name'], property);
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