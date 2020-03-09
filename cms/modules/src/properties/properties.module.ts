import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFile, faFolder, faCube, faImage, faBars, faHashtag, faList } from '@fortawesome/free-solid-svg-icons';
import { EditorModule } from '@tinymce/tinymce-angular';

import { CoreModule, CMS } from '@angular-cms/core';

import { CmsBsDropdownModule } from '../shared/libs/ngx-bootstrap/bs-dropdown.module';
import { DndModule } from '../shared/drag-drop/dnd.module';

import { InputComponent } from './input/input.component';

import { TextareaComponent } from './textarea/textarea.component';

import { ObjectListProperty } from './object-list/object-list.property';
import { ObjectListControl } from './object-list/object-list.control';

import { TinymceComponent } from './xhtml/tinymce.component';
import { DropdownComponent } from './select/dropdown/dropdown.component';

import { CheckboxComponent } from './select/checkbox/checkbox.component';
import { CheckboxGroupControl } from './select/checkbox/checkbox-group.control';

import { ContentAreaControl } from './content-area/content-area.control';
import { ContentAreaProperty } from './content-area/content-area.property';

import { ContentReferenceControl } from './content-reference/content-reference.control';
import { ContentReferenceComponent } from './content-reference/content-reference.component';

import { registerCmsProperties } from './registerCmsProperties';

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
        ObjectListProperty,
        ObjectListControl,
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
        ObjectListProperty,
        TinymceComponent,
        ContentAreaProperty,
        ContentReferenceComponent
    ],
    exports: [
        InputComponent,
        TextareaComponent,
        DropdownComponent,
        CheckboxComponent,
        ObjectListProperty,
        TinymceComponent,
        ContentAreaProperty,

        ContentReferenceControl,
        ContentReferenceComponent
    ],
    providers: [
        ...CMS.PROPERTY_PROVIDERS
    ]
})
export class PropertiesModule {
    constructor(private library: FaIconLibrary) {
        library.addIcons(faFolder, faFile, faImage, faCube, faBars, faHashtag, faList);
    }
}