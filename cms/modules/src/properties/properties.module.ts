import { NgModule, InjectionToken } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFile, faFolder, faCube, faImage, faBars } from '@fortawesome/free-solid-svg-icons';

import { EditorModule } from '@tinymce/tinymce-angular';
import { CoreModule, CMS } from '@angular-cms/core';

import { DndModule } from '../shared/drag-drop/dnd.module';

import { InputComponent } from './input/input.component';

import { TextareaComponent } from './textarea/textarea.component';

import { PropertyListComponent } from './property-list/property-list.component';
import { PropertyListControl } from './property-list/property-list.control';

import { TinymceComponent } from './xhtml/tinymce.component';
import { DropdownComponent } from './select/dropdown/dropdown.component';

import { CheckboxComponent } from './select/checkbox/checkbox.component';
import { CheckboxGroupControl } from './select/checkbox/checkbox-group.control';

import { ContentAreaControl } from './content-area/content-area.control';
import { ContentAreaProperty } from './content-area/content-area.property';

import { ContentReferenceControl } from './content-reference/content-reference.control';
import { ContentReferenceComponent } from './content-reference/content-reference.component';

import { registerCmsProperties } from './registerCmsProperties';
import { CmsBsDropdownModule } from '../shared/libs/ngx-bootstrap/bs-dropdown.module';
import { RouterModule } from '@angular/router';

registerCmsProperties();

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        EditorModule,
        FontAwesomeModule,
        CmsBsDropdownModule.forRoot(),
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
        ContentAreaProperty,
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
        ContentAreaProperty,
        ContentReferenceComponent
    ],
    exports: [
        InputComponent,
        TextareaComponent,
        DropdownComponent,
        CheckboxComponent,
        PropertyListComponent,
        TinymceComponent,
        ContentAreaProperty,

        ContentReferenceControl,
        ContentReferenceComponent
    ],
    providers: [
        ...CMS.NG_PROPERTY_PROVIDERS
    ]
})
export class PropertiesModule {
    constructor(private library: FaIconLibrary) {
        library.addIcons(faFolder, faFile, faImage, faCube, faBars);
    }
}