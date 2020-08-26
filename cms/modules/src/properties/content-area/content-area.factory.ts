import { ComponentRef, Injectable, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CmsPropertyFactory, ContentTypeProperty, UIHint, Content, ChildItemRef } from '@angular-cms/core';
import { ContentAreaProperty } from './content-area.property';
import { ContentAreaItem } from './content-area.model';

@Injectable()
export class ContentAreaFactory extends CmsPropertyFactory {
    constructor(injector: Injector) {
        super(injector, UIHint.ContentArea, ContentAreaProperty);
    }

    createPropertyComponent(property: ContentTypeProperty, formGroup: FormGroup): ComponentRef<any> {
        const propertyComponent = this.createDefaultCmsPropertyComponent(property, formGroup);

        if (propertyComponent.instance instanceof ContentAreaProperty) {
            (<ContentAreaProperty>propertyComponent.instance).allowedTypes = property.metadata.allowedTypes;
        }

        return propertyComponent;
    }

    getPopulatedReferenceProperty(contentData: Content, property: ContentTypeProperty): any {
        const childItems = contentData.childItems;

        const contentAreaItems: ContentAreaItem[] = contentData.properties[property.name];
        if (Array.isArray(contentAreaItems)) {
            contentAreaItems.forEach(areaItem => {
                const matchItem = childItems.find(x => x.content._id === areaItem._id);
                if (matchItem) {
                    Object.assign(areaItem, { name: matchItem.content.name, isPublished: matchItem.content.isPublished });
                }
            });
        }
        return contentAreaItems;
    }

    getChildItemsRef(contentData: Content, property: ContentTypeProperty): ChildItemRef[] {
        const childItems: ChildItemRef[] = [];

        const contentAreaItems: ContentAreaItem[] = contentData.properties[property.name];
        if (Array.isArray(contentAreaItems)) {
            contentAreaItems.forEach(areaItem => {
                const itemIndexOf = childItems.findIndex(x => x.content && x.content === areaItem._id);
                if (itemIndexOf === -1) {
                    const refPath = this.getRefPathFromContentType(areaItem.type);
                    if (refPath) { childItems.push({ refPath, content: areaItem._id }); }
                }
            });
        }
        return childItems;
    }
}


