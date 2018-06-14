import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CoreModule, DndModule } from '@angular-cms/core';

import { InputComponent } from './input/input.component';
import { TextareaComponent } from './textarea/textarea.component';
import { PropertyListComponent } from './property-list/property-list.component';
import { PropertyGroupComponent } from './property-list/property-group.component';
import { HiddenInputControl } from './xhtml/hidden-input';
import { TinymceComponent } from './xhtml/tinymce.component';
import { DropdownComponent } from './select/dropdown/dropdown.component';
import { CheckboxComponent } from './select/checkbox/checkbox.component';
import { CheckboxGroupComponent } from './select/checkbox/checkbox-group.component';

import { ContentGroupComponent } from './content-area/content-group.component';
import { ContentAreaComponent } from './content-area/content-area.component';
import { registerCmsProperties } from './registerCmsProperties';

registerCmsProperties();

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
        DndModule.forRoot()
    ],
    declarations: [
        InputComponent,
        TextareaComponent,
        DropdownComponent,
        CheckboxGroupComponent,
        CheckboxComponent,
        PropertyGroupComponent,
        PropertyListComponent,
        HiddenInputControl,
        TinymceComponent,
        ContentAreaComponent,
        ContentGroupComponent
    ],
    entryComponents: [
        InputComponent,
        TextareaComponent,
        DropdownComponent,
        CheckboxComponent,
        PropertyListComponent,
        TinymceComponent,
        ContentAreaComponent
    ],
    exports: [
        InputComponent,
        TextareaComponent,
        DropdownComponent,
        CheckboxComponent,
        PropertyListComponent,
        TinymceComponent,
        ContentAreaComponent
    ]
})
export class PropertiesModule { }


