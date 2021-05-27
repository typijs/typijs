import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TypiJsModule } from '@typijs/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { HeroBannerComponent } from '../shared/hero-banner/hero-banner.component';
import { ArticleComponent } from './article/article.component';
import { BlogComponent } from './blog/blog.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { ProductListingComponent } from './product/product-listing.component';
import { ProductPartialComponent } from './product/product-partial.component';
import { ProductComponent } from './product/product.component';
import { StandardPageComponent } from './standard/standard.component';
import { WishlistComponent } from './wishlist/wishlist.component';

const PAGES_COMPONENT = [
    ArticleComponent,
    BlogComponent,
    ContactComponent,
    HomeComponent,
    ProductComponent,
    ProductPartialComponent,
    ProductListingComponent,
    CartComponent,
    CheckoutComponent,
    WishlistComponent,
    StandardPageComponent,
    HeroBannerComponent
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        PaginationModule.forRoot(),
        TypiJsModule
    ],
    declarations: [
        ...PAGES_COMPONENT
    ]
})
export class PagesModule { }
