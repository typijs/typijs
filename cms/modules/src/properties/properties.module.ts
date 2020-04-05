import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFile, faFolder, faCube, faImage, faBars, faHashtag, faList, faTimes } from '@fortawesome/free-solid-svg-icons';
import { EditorModule } from '@tinymce/tinymce-angular';

import { CoreModule } from '@angular-cms/core';

import { CmsBsDropdownModule } from '../shared/libs/ngx-bootstrap/bs-dropdown.module';
import { DndModule } from '../shared/drag-drop/dnd.module';

import { TextProperty } from './text/text.property';

import { TextareaProperty } from './textarea/textarea.property';

import { ObjectListProperty } from './object-list/object-list.property';
import { ObjectListControl } from './object-list/object-list.control';

import { XHtmlProperty } from './xhtml/xhtml.property';
import { DropdownProperty } from './select/dropdown/dropdown.property';

import { CheckboxProperty } from './select/checkbox/checkbox.property';
import { CheckboxGroupControl } from './select/checkbox/checkbox-group.control';

import { ContentAreaControl } from './content-area/content-area.control';
import { ContentAreaProperty } from './content-area/content-area.property';

import { ContentReferenceControl } from './content-reference/content-reference.control';
import { ContentReferenceProperty } from './content-reference/content-reference.property';

import { registerCmsProperties } from './registerCmsProperties';
import { ImageReferenceProperty } from './image-reference/image-reference.property';
import { ImageReferenceControl } from './image-reference/image-reference.control';

registerCmsProperties();

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        EditorModule,
        FontAwesomeModule,
        CmsBsDropdownModule,
        CoreModule,
        DndModule
    ],
    declarations: [
        TextProperty,
        TextareaProperty,
        DropdownProperty,
        CheckboxGroupControl,
        CheckboxProperty,
        ObjectListProperty,
        ObjectListControl,
        XHtmlProperty,

        ContentAreaProperty,
        ContentAreaControl,

        ContentReferenceControl,
        ContentReferenceProperty,

        ImageReferenceControl,
        ImageReferenceProperty
    ],
    entryComponents: [
        TextProperty,
        TextareaProperty,
        DropdownProperty,
        CheckboxProperty,
        ObjectListProperty,
        XHtmlProperty,
        ContentAreaProperty,
        ContentReferenceProperty,
        ImageReferenceProperty
    ],
    exports: [
        TextProperty,
        TextareaProperty,
        DropdownProperty,
        CheckboxProperty,
        ObjectListProperty,
        XHtmlProperty,
        ContentAreaProperty,

        ContentReferenceControl,
        ContentReferenceProperty,
        ImageReferenceProperty
    ]
})
export class PropertiesModule {
    constructor(library: FaIconLibrary) {
        library.addIcons(faFolder, faFile, faImage, faCube, faBars, faHashtag, faList, faTimes);
    }
}