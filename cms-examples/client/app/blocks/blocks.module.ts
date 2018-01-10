import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FeatureBlockComponent } from './feature-block/feature-block.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
    ],
    entryComponents: [
        FeatureBlockComponent
    ],
    declarations: [
        FeatureBlockComponent
    ]
})
export class BlocksModule { }