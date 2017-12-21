import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { InputComponent } from './input/input.component';
import { TextareaComponent } from './textarea/textarea.component';
import { PropertyListComponent } from './property-list/property-list.component';
import { CmsPublicModule } from '../../cms-public.module';
import { PropertyListItemComponent } from './property-list/property-list-item.component';
import { TinymceComponent } from './xhtml/tinymce.component';
import { DropdownComponent } from './select/dropdown/dropdown.component';
import { CheckboxComponent } from './select/checkbox/checkbox.component';
import { CheckboxElement } from './select/checkbox/checkbox.element';
import { CheckboxGroupComponent } from './select/checkbox/checkbox-group.component';

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
        DropdownComponent,
        CheckboxGroupComponent,
        CheckboxComponent,
        CheckboxElement,
        PropertyListComponent,
        PropertyListItemComponent,
        TinymceComponent
    ],
    entryComponents: [
        InputComponent,
        TextareaComponent,
        DropdownComponent,
        CheckboxElement,
        PropertyListComponent,
        TinymceComponent
    ],
    exports: [
        InputComponent,
        TextareaComponent,
        DropdownComponent,
        CheckboxElement,
        PropertyListComponent,
        TinymceComponent
    ]
})
export class FormElementsModule { }


