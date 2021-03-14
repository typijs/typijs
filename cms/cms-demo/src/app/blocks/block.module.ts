import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AngularCms } from '@angular-cms/core';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { LinkListComponent } from './link-list/link-list.component';
import { BestPriceComponent } from './best-price/best-price.component';
import { CarouselComponent } from './carousel/carousel.component';
import { CarouselItemComponent } from './carousel/carousel-item.component';
import { CategoryComponent } from './category/category.component';
import { CategoryContainerComponent } from './category/category-container.component';
import { FeatureProductsComponent } from './feature-product/feature-products.component';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { PartnerComponent } from './partner/partner.component';
import { PartnerContainerComponent } from './partner/partner-container.component';
import { ServiceComponent } from './service/service.component';
import { ServiceContainerComponent } from './service/service-container.component';
import { TestimonyComponent } from './testimony/testimony.component';
import { TestimonyItemComponent } from './testimony/testimony-item.component';
import { VideoComponent } from './video/video.component';

const BLOCKS_COMPONENT = [
    BestPriceComponent,
    CarouselComponent,
    CarouselItemComponent,
    CategoryComponent,
    CategoryContainerComponent,
    ContactUsComponent,
    FeatureProductsComponent,
    LinkListComponent,
    NewsletterComponent,
    PartnerComponent,
    PartnerContainerComponent,
    ServiceComponent,
    ServiceContainerComponent,
    TestimonyComponent,
    TestimonyItemComponent,
    VideoComponent
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AngularCms
    ],
    declarations: [
        ...BLOCKS_COMPONENT
    ]
})
export class BlocksModule { }
