import { Routes, Route } from '@angular/router';
import { CmsModuleConfig, CmsModuleRoot, CmsComponentConfig, CmsObject } from './constants/types';


/**
 * The type of global CMS model. It keeps all cms configurations
 */
export type CmsModel = {
    /**
     * This property keeps all Page Types class was registered via decorator `@PageType`
     */
    PAGE_TYPES: CmsObject;
    /**
     * This property keeps all Block Types class was registered via decorator `@BlockType`
     */
    BLOCK_TYPES: CmsObject;
    /**
     * This property keeps all Media Types class was registered via decorator `@MediaType`
     */
    MEDIA_TYPES: CmsObject;
    /**
     * This property keeps all the CMS property types including build-in properties such as `ContentArea`, `ObjectList`...
     * 
     * Each property type will be mapped to UIHint key
     */
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
    MEDIA_TYPES: {},
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