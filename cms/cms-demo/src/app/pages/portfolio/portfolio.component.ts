import { Component, OnInit } from '@angular/core';
import { CmsComponent } from '@angular-cms/core';
import { PortfolioPage } from './portfolio.pagetype';

@Component({
    templateUrl: 'portfolio.component.html'
})

export class PortfolioComponent extends CmsComponent<PortfolioPage> {
    constructor() {
        super();
    }
}