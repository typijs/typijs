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

import { ContentGroupComponent } from './content-area/content-group.component';
import { ContentAreaComponent } from './content-area/content-area.component';

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
        TinymceComponent,
        ContentAreaComponent,
        ContentGroupComponent
    ],
    entryComponents: [
        InputComponent,
        TextareaComponent,
        DropdownComponent,
        CheckboxElement,
        PropertyListComponent,
        TinymceComponent,
        ContentAreaComponent
    ],
    exports: [
        InputComponent,
        TextareaComponent,
        DropdownComponent,
        CheckboxElement,
        PropertyListComponent,
        TinymceComponent,
        ContentAreaComponent
    ]
})
export class FormElementsModule { }


