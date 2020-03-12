import { Input, Inject } from '@angular/core';

import { ContentData } from './content-data';
import { ContentTypeService } from '../services/content-type.service';
import { AppInjector } from '../utils/appInjector';

export abstract class CmsComponent<T extends ContentData> {
    @Input() currentContent: T;
    protected contentTypeService: ContentTypeService = AppInjector.get(ContentTypeService);

    public getProperty<K extends keyof T>(propertyName: K): T[K] {
        const contentType = this.currentContent.contentType;
        const propertyInfo = this.contentTypeService.getPageTypeProperty(contentType, propertyName.toString());

        return this.currentContent[propertyName]; // o[propertyName] is of type T[K]
    }
    /**
     * Gets property for using expression
     * 
     * Example:
     * 
     * ```
     * <ng-template [cmsContentArea]="getPropertyFor(x=>x.features)"></ng-template>
     * ```
     * 
     * Currently, it is not supported in Angular Template syntax. https://github.com/angular/angular/issues/14129
     * @param expression (obj: T) => any
     * @returns  
     */
    public getPropertyFor(expression: (obj: T) => any) {
        const propertyName = this.getPropertyName(expression);
        const contentType = this.currentContent.contentType;
        const propertyInfo = this.contentTypeService.getPageTypeProperty(contentType, propertyName);

        return this.currentContent[propertyName];
    }

    /**
     * Gets property name of current content object
     * 
     * https://stackoverflow.com/questions/13612006/get-object-property-name-as-a-string/32542368#32542368
     * @param expression
     * @returns  
     */
    private getPropertyName(expression: (obj: T) => any): string {
        const res = <T>{};
        Object.keys(this.currentContent).forEach(key => { res[key] = () => key; });
        return expression(res)();
    }
}