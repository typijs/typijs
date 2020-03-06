import { Property, PageType, UIHint, PageData } from '@angular-cms/core';
import { HomeComponent } from './home.component';

@PageType({
    displayName: "Home Page",
    componentRef: HomeComponent,
    description: "This is home page type"
})
export class HomePage extends PageData {

    @Property({
        displayName: "Logo",
        displayType: UIHint.Input
    })
    logo: string;

    @Property({
        displayName: "Latest Projects Page Root",
        displayType: UIHint.Input
    })
    latestProjectRoot: string;

    @Property({
        displayName: "Highlight Features",
        description: "This is highlight feature will be in banner area",
        displayType: UIHint.ContentArea,
        allowedTypes: ['FeatureBlock', 'PortfolioBlock']
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
        displayType: UIHint.Xhtml
    })
    footerText: string;
}