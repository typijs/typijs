import { Property, PageType, UIHint, PageData, CmsImage, ContentReference } from '@angular-cms/core';
import { HomeComponent } from './home.component';

@PageType({
    displayName: "Home Page",
    componentRef: HomeComponent,
    description: "This is home page type"
})
export class HomePage extends PageData {

    @Property({
        displayName: "Logo",
        displayType: UIHint.Image
    })
    logo: CmsImage;

    @Property({
        displayName: "Projects Page Root",
        displayType: UIHint.ContentReference,
        allowedTypes: ['PortfolioPage'],
    })
    latestProjectRoot: ContentReference;

    @Property({
        displayName: "Highlight Features",
        description: "This is highlight feature will be in banner area",
        displayType: UIHint.ContentArea,
        allowedTypes: ['FeatureBlock', 'PortfolioBlock'],
        newProperty: 'abc'
    })
    features: Array<any>;

    @Property({
        displayName: "Highlight Portfolios",
        displayType: UIHint.ContentArea,
        allowedTypes: ['PortfolioBlock']
    })
    portfolios: Array<any>;

    @Property({
        displayName: "Footer",
        displayType: UIHint.ContentArea
    })
    footer: Array<any>;

    @Property({
        displayName: "Footer Text",
        description: "This is footer text to show the copyright",
        displayType: UIHint.XHtml
    })
    footerText: string;
}