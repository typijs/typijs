import { Routes, Route } from '@angular/router';
import { PAGE_TYPE_INDICATOR, BLOCK_TYPE_INDICATOR } from './constants/meta-keys';
import { CmsModuleConfig, CmsModuleRoot, CmsComponentConfig } from './constants/module-config';

export type CmsObject = { [key: string]: any };

export type CmsModel = {
    PAGE_TYPES: CmsObject;
    BLOCK_TYPES: CmsObject;
    PROPERTIES: CmsObject;
    PROPERTY_PROVIDERS: Array<any>;

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
    PROPERTY_PROVIDERS: [],

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
}