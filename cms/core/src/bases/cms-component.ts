import { Input } from '@angular/core';

import { ContentData } from './content-data';
import { ContentTypeService } from '../services/content-type.service';
import { AppInjector } from '../utils/appInjector';
import { PropertyModel } from '../constants/types';

export abstract class CmsComponent<T extends ContentData> {
    @Input() currentContent: T;
    protected contentTypeService: ContentTypeService = AppInjector.get(ContentTypeService);

    public getProperty<K extends keyof T>(propertyName: K): PropertyModel {
        const contentType = this.currentContent.contentType;
        const propertyInfo = this.contentTypeService.getPageTypeProperty(contentType, propertyName.toString());

        return <PropertyModel>{
            value: this.currentContent[propertyName],
            property: propertyInfo
        }
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
    public getPropertyFor(expression: (obj: T) => any): PropertyModel {
        const propertyName = this.getPropertyName(expression);
        const contentType = this.currentContent.contentType;
        const propertyInfo = this.contentTypeService.getPageTypeProperty(contentType, propertyName);

        return <PropertyModel>{
            value: this.currentContent[propertyName],
            property: propertyInfo
        }
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