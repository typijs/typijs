import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { InputComponent } from './input/input.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
    ],
    declarations: [
        InputComponent
    ],
    entryComponents: [
        InputComponent
    ],
    exports: [
        InputComponent
    ]
})
export class FormElementsModule { }


