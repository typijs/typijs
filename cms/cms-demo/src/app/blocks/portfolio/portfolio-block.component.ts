import { Component } from '@angular/core';
import { CmsComponent } from '@angular-cms/core';
import { PortfolioBlock } from './portfolio.blocktype';

@Component({
    selector: '[portfolio-block]',
    templateUrl: 'portfolio-block.component.html'
})

export class PortfolioBlockComponent extends CmsComponent<PortfolioBlock> {
    constructor() {
        super();
    }
}