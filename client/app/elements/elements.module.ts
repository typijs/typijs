import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { StringComponent } from './string/string.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
    ],
    entryComponents: [
        StringComponent
    ],
    exports: [
        StringComponent
    ],
    declarations: [
        StringComponent
    ]
})
export class ElementsModule { }