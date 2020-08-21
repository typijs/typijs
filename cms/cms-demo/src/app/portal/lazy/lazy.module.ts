import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LazyRoutingModule } from './lazy.routes';
import { LazyComponent } from './lazy.component';

@NgModule({
    imports: [
        CommonModule,
        LazyRoutingModule
    ],
    declarations: [
        LazyComponent,
    ],
    entryComponents: [
        LazyComponent,
    ]
})
export class LazyModule { }
