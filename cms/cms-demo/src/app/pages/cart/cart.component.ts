import { CmsComponent, SiteDefinition } from '@typijs/core';
import { Component, OnInit } from '@angular/core';
import { HomePage } from '../home/home.pagetype';
import { CartPage } from './cart.pagetype';

@Component({
    templateUrl: './cart.component.html'
})
export class CartComponent extends CmsComponent<CartPage> implements OnInit {
    startPage: HomePage;
    constructor(private siteDefinition: SiteDefinition) {
        super();
    }

    ngOnInit() {
        this.siteDefinition.getStartPage<HomePage>().subscribe(startPage => this.startPage = startPage);
    }
}
