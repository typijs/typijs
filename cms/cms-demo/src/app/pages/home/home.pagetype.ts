import { Property, PageType, UIHint, ValidationTypes, PageData } from '@angular-cms/core';
import { FeatureItem } from './feature-item';
import { HomeComponent } from './home.component';

@PageType({
    displayName: "Home Page",
    componentRef: HomeComponent,
    description: "This is home page type"
})
export class HomePage extends PageData {

    @Property({
        displayName: "Title",
        displayType: UIHint.Input,
        validates: [ValidationTypes.required("This is min required")]
    })
    title: string;

    @Property({
        displayName: "Logo",
        displayType: UIHint.Input
    })
    logo: string;

    @Property({
        displayName: "Banner Image",
        displayType: UIHint.Input
    })
    bannerImage: string;

    @Property({
        displayName: "Banner Text",
        displayType: UIHint.Xhtml
    })
    bannerText: string;

    @Property({
        displayName: "Highlights",
        description: "This is highlight item will be in banner area",
        displayType: UIHint.ContentArea
    })
    highlights: Array<any>;

    @Property({
        displayName: "Carousel",
        displayType: UIHint.ContentArea
    })
    carousel: Array<any>;

    @Property({
        displayName: "Features",
        displayType: UIHint.PropertyList,
        propertyListItemType: FeatureItem,
    })
    features: Array<FeatureItem>;

    @Property({
        displayName: "Footer",
        displayType: UIHint.ContentArea
    })
    footer: Array<any>;

    @Property({
        displayName: "Footer Text",
        description: "This is footer text to show the copyright",
        displayType: UIHint.Xhtml
    })
    footerText: string;
}