import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CoreModule } from '@angular-cms/core';

import { InputComponent } from './input/input.component';
import { TextareaComponent } from './textarea/textarea.component';
import { PropertyListComponent } from './property-list/property-list.component';
import { PropertyGroupComponent } from './property-list/property-group.component';
import { PropertyListItemComponent } from './property-list/property-list-item.component';
import { TinymceComponent } from './xhtml/tinymce.component';
import { DropdownComponent } from './select/dropdown/dropdown.component';
import { CheckboxElement } from './select/checkbox/checkbox.element';
import { CheckboxGroupComponent } from './select/checkbox/checkbox-group.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule
    ],
    declarations: [
        InputComponent,
        TextareaComponent,
        DropdownComponent,
        CheckboxGroupComponent,
        CheckboxElement,
        PropertyGroupComponent,
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


