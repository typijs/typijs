import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CoreModule } from '@angular-cms/core';
import { FeatureComponent } from './feature/feature.component';
import { PortfolioBlockComponent } from './portfolio/portfolio-block.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { LinkListComponent } from './link-list/link-list.component';

const BLOCKS_COMPONENT = [
    FeatureComponent,
    PortfolioBlockComponent,
    ContactUsComponent,
    LinkListComponent
]

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CoreModule
    ],
    entryComponents: [
        ...BLOCKS_COMPONENT
    ],
    declarations: [
        ...BLOCKS_COMPONENT
    ]
})
export class BlocksModule { }