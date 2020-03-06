import { Routes, Route } from '@angular/router';
import { PAGE_TYPE_INDICATOR, BLOCK_TYPE_INDICATOR } from './constants/meta-keys';
import { CmsModuleConfig, CmsModuleRoot, CmsComponentConfig } from './constants/module-config';
import { CmsProperty, CmsPropertyProvider, PROPERTY_PROVIDERS_TOKEN } from './bases/cms-property';
import { InjectionToken } from '@angular/core';

export type CmsObject = { [key: string]: any };

export type CmsModel = {
    PAGE_TYPES: CmsObject;
    BLOCK_TYPES: CmsObject;
    PROPERTIES: CmsObject;
    PROPERTY_PROVIDERS: CmsObject;
    NG_PROPERTY_PROVIDERS: Array<any>;

    MODULES: Array<CmsModuleConfig>;
    NG_MODULES: Array<any>;

    EDITOR_ROUTES(): Array<Route>;
    EDITOR_WIDGETS(): Array<CmsComponentConfig>;

    ADMIN_ROUTES(): Array<Route>;
    ADMIN_WIDGETS(): Array<CmsComponentConfig>;

    REGISTER_MODULES(): Array<any>;
}

export const CMS: CmsModel = {
    PAGE_TYPES: {},
    BLOCK_TYPES: {},
    PROPERTIES: {},
    PROPERTY_PROVIDERS: {},
    NG_PROPERTY_PROVIDERS: [],

    MODULES: [],
    NG_MODULES: [],

    EDITOR_ROUTES(): Array<Route> {
        let editorRoutes = [];
        this.MODULES.map(x => x.roots).reduce((a, b) => a.concat(b)).filter(x => x.name == CmsModuleRoot.Editor).map(x => x.routes).forEach((routes: Routes) => {
            if (routes)
                editorRoutes = editorRoutes.concat(routes);
        });;
        return editorRoutes;
    },
    EDITOR_WIDGETS(): Array<CmsComponentConfig> {
        let editorWidgets = [];
        this.MODULES.map(x => x.roots).reduce((a, b) => a.concat(b)).filter(x => x.name == CmsModuleRoot.Editor).map(x => x.widgets).forEach((widgets: CmsComponentConfig[]) => {
            if (widgets)
                editorWidgets = editorWidgets.concat(widgets);
        });;
        return editorWidgets;
    },
    ADMIN_ROUTES(): Array<Route> {
        let adminRoutes = [];
        this.MODULES.map(x => x.roots).reduce((a, b) => a.concat(b)).filter(x => x.name == CmsModuleRoot.Admin).map(x => x.routes).forEach((routes: Routes) => {
            if (routes)
                adminRoutes = adminRoutes.concat(routes);
        });;
        return adminRoutes;
    },
    ADMIN_WIDGETS(): Array<CmsComponentConfig> {
        let adminWidgets = [];
        this.MODULES.map(x => x.roots).reduce((a, b) => a.concat(b)).filter(x => x.name == CmsModuleRoot.Admin).map(x => x.widgets).forEach((widgets: CmsComponentConfig[]) => {
            if (widgets)
                adminWidgets = adminWidgets.concat(widgets);
        });;
        return adminWidgets;
    },

    REGISTER_MODULES(): Array<any> {
        return this.MODULES.map(x => x.module);
    }
};

//register multi content types with cms
//https://www.laurivan.com/scan-decorated-classes-in-typescript/
export function registerContentTypes(theEntryScope: any) {
    for (let prop in theEntryScope) {
        if (theEntryScope[prop][PAGE_TYPE_INDICATOR]) {
            CMS.PAGE_TYPES[prop] = theEntryScope[prop];
        }

        if (theEntryScope[prop][BLOCK_TYPE_INDICATOR]) {
            CMS.BLOCK_TYPES[prop] = theEntryScope[prop];
        }
    }
}

//register a property with cms
export function registerProperty(uniquePropertyKey: string, property: Function, propertyProvider?: Function) {
    if (!uniquePropertyKey || !property) return;

    if (CMS.PROPERTIES.hasOwnProperty(uniquePropertyKey)) {
        console.warn('Warning: CMS.PROPERTIES has already property ', uniquePropertyKey)
    }

    CMS.PROPERTIES[uniquePropertyKey] = property;

    if (propertyProvider) {
        CMS.NG_PROPERTY_PROVIDERS.push({ provide: PROPERTY_PROVIDERS_TOKEN, useClass: propertyProvider, multi: true });
        CMS.PROPERTY_PROVIDERS[uniquePropertyKey] = propertyProvider;
    }
}

//register multi properties with cms
export function registerProperties(properties: Array<Function> | Array<[string, Function] | [string, Function, Function]>) {
    if (properties instanceof Array) {
        for (const property of properties) {
            if (property instanceof Function) {
                registerProperty(property['name'], property);
            }
            else if (property instanceof Array && property.length == 2) {
                registerProperty(property[0], property[1]);
            }
            else if (property instanceof Array && property.length == 3) {
                registerProperty(property[0], property[1], property[2]);
            }
        }
    }
}

//register module with cms
export function registerModule(moduleConfig: CmsModuleConfig) {
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