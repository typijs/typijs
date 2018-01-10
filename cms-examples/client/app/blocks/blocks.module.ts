import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FeatureBlockComponent } from './feature-block/feature-block.component';
import { CoreModule } from '@angular-cms/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CoreModule
    ],
    entryComponents: [
        FeatureBlockComponent
    ],
    declarations: [
        FeatureBlockComponent
    ]
})
export class BlocksModule { }