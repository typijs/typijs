import { Injectable } from '@angular/core';
import { Property, PageType, UIType, ValidationTypes, PageData } from '@angular-cms/core';
import { FooterItem } from './footer-item';
import { HomeComponent } from './home.component';

@PageType({
    displayName: "Home Page",
    componentRef: HomeComponent,
    description: "This is home page type"
})
export class HomePage extends PageData {

    @Property({
        displayName: "Title",
        displayType: UIType.Input,
        validates: [
            ValidationTypes.required("This is min required")]
    })
    title: string;

    @Property({
        displayName: "Banner Image",
        displayType: UIType.Input
    })
    bannerImage: string;

    @Property({
        displayName: "Banner Summary",
        displayType: UIType.Xhtml
    })
    summary: string;

    @Property({
        displayName: "Features",
        displayType: UIType.ContentArea
    })
    features: Array<any>

    @Property({
        displayName: "Footer",
        displayType: UIType.PropertyList,
        propertyListItemType: FooterItem,
    })
    footers: Array<FooterItem>
}