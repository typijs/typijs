import { Component } from '@angular/core';
import { CmsComponent } from '@angular-cms/core';
import { PortfolioBlock } from './portfolio.blocktype';

@Component({
    selector: '[portfolio-block]',
    host: { 'class': 'grid_1_of_3 images_1_of_3' },
    templateUrl: 'portfolio-block.component.html'
})

export class PortfolioBlockComponent extends CmsComponent<PortfolioBlock> {
    constructor() {
        super();
    }
}