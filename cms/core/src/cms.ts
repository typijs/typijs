import { Routes, Route } from '@angular/router';
import { PAGE_TYPE_INDICATOR, BLOCK_TYPE_INDICATOR } from './constants/meta-keys';
import { CmsModuleConfig, CmsModuleRoot, CmsComponentConfig } from './constants/module-config';

export interface CmsModel {
    PAGE_TYPES: object;
    BLOCK_TYPES: object;
    PROPERTIES: object;

    MODULES: Array<CmsModuleConfig>;

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

    MODULES: [],

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
export function registerProperty(property: any, uniqueAccessKey?: string) {
    if (property) {
        if (uniqueAccessKey) {
            if (CMS.PROPERTIES.hasOwnProperty(uniqueAccessKey)) {
                console.warn('Warning: CMS.PROPERTIES has already property ', uniqueAccessKey)
            }
            CMS.PROPERTIES[uniqueAccessKey] = property
        } else {
            if (CMS.PROPERTIES.hasOwnProperty(property['name'])) {
                console.warn('Warning: CMS.PROPERTIES has already property ', property['name'])
            }
            CMS.PROPERTIES[property['name']] = property;
        }
    }
}

//register multi properties with cms
export function registerProperties(properties: Array<[string, Function]> | Array<Function>) {
    if (properties instanceof Array) {
        for (const property of properties) {
            if (property instanceof Function) {
                registerProperty(property);
            } else if (property instanceof Array && property.length == 2) {
                registerProperty(property[1], property[0]);
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
            console.warn(`The module ${moduleName} has already registed`);
        } else {
            CMS.MODULES.push(moduleConfig);
        }
    }
}