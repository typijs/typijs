import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { InputComponent } from './input/input.component';
import { TextareaComponent } from './textarea/textarea.component';
import { SelectComponent } from './select/select.component';
import { PropertyListComponent } from './property-list/property-list.component';
import { CmsPublicModule } from '../../cms-public.module';
import { PropertyListItemComponent } from './property-list/property-list-item.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CmsPublicModule
    ],
    declarations: [
        InputComponent,
        TextareaComponent,
        SelectComponent,
        PropertyListComponent,
        PropertyListItemComponent
    ],
    entryComponents: [
        InputComponent,
        TextareaComponent,
        SelectComponent,
        PropertyListComponent
    ],
    exports: [
        InputComponent,
        TextareaComponent,
        SelectComponent,
        PropertyListComponent
    ]
})
export class FormElementsModule { }


