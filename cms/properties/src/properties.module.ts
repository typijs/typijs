import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { EditorModule } from '@tinymce/tinymce-angular';
import { CoreModule, DndModule } from '@angular-cms/core';

import { InputComponent } from './input/input.component';

import { TextareaComponent } from './textarea/textarea.component';

import { PropertyListComponent } from './property-list/property-list.component';
import { PropertyListControl } from './property-list/property-list.control';

import { TinymceComponent } from './xhtml/tinymce.component';
import { DropdownComponent } from './select/dropdown/dropdown.component';

import { CheckboxComponent } from './select/checkbox/checkbox.component';
import { CheckboxGroupControl } from './select/checkbox/checkbox-group.control';

import { ContentAreaControl } from './content-area/content-area.control';
import { ContentAreaComponent } from './content-area/content-area.component';

import { ContentReferenceControl } from './content-reference/content-reference.control';
import { ContentReferenceComponent } from './content-reference/content-reference.component';

import { registerCmsProperties } from './registerCmsProperties';

registerCmsProperties();

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        EditorModule,
        CoreModule,
        DndModule
    ],
    declarations: [
        InputComponent,
        TextareaComponent,
        DropdownComponent,
        CheckboxGroupControl,
        CheckboxComponent,
        PropertyListControl,
        PropertyListComponent,
        TinymceComponent,
        ContentAreaComponent,
        ContentAreaControl,

        ContentReferenceControl,
        ContentReferenceComponent
    ],
    entryComponents: [
        InputComponent,
        TextareaComponent,
        DropdownComponent,
        CheckboxComponent,
        PropertyListComponent,
        TinymceComponent,
        ContentAreaComponent,
        ContentReferenceComponent
    ],
    exports: [
        InputComponent,
        TextareaComponent,
        DropdownComponent,
        CheckboxComponent,
        PropertyListComponent,
        TinymceComponent,
        ContentAreaComponent,

        ContentReferenceControl,
        ContentReferenceComponent
    ]
})
export class PropertiesModule { }


