import { CoreModule, DEFAULT_PROPERTY_FACTORIES } from '@angular-cms/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { QuillModule } from 'ngx-quill';
import { DndModule } from '../shared/drag-drop/dnd.module';
import { DynamicFormService } from '../shared/services/dynamic-form.service';
import { CheckboxPropertyFactory } from './checkbox/checkbox.factory';
import { CheckboxProperty } from './checkbox/checkbox.property';
import { ContentAreaControl } from './content-area/content-area.control';
import { ContentAreaFactory } from './content-area/content-area.factory';
import { ContentAreaProperty } from './content-area/content-area.property';
import { ContentReferenceControl } from './content-reference/content-reference.control';
import { ContentReferenceFactory } from './content-reference/content-reference.factory';
import { ContentReferenceProperty } from './content-reference/content-reference.property';
import { ImageReferenceControl } from './image-reference/image-reference.control';
import { ImagePropertyFactory } from './image-reference/image-reference.factory';
import { ImageReferenceProperty } from './image-reference/image-reference.property';
import { ObjectDetailsComponent } from './object-list/object-details.component';
import { ObjectListControl } from './object-list/object-list.control';
import { ObjectListFactory } from './object-list/object-list.factory';
import { ObjectListProperty } from './object-list/object-list.property';
import { CheckboxListControl } from './select/checkbox-list/checkbox-list.control';
import { CheckboxListProperty } from './select/checkbox-list/checkbox-list.property';
import { DropdownProperty } from './select/dropdown/dropdown.property';
import { CheckboxListPropertyFactory, DropdownPropertyFactory } from './select/select-property.factory';
import { TextPropertyFactory } from './text/text.factory';
import { TextProperty } from './text/text.property';
import { TextareaPropertyFactory } from './textarea/textarea.factory';
import { TextareaProperty } from './textarea/textarea.property';
import { XHtmlPropertyFactory } from './xhtml/xhtml.factory';
import { XHtmlProperty } from './xhtml/xhtml.property';

export const PROPERTIES = [
    TextProperty,
    TextareaProperty,
    CheckboxProperty,
    DropdownProperty,
    CheckboxListProperty,
    ObjectListProperty,
    XHtmlProperty,
    ContentAreaProperty,
    ContentReferenceProperty,
    ImageReferenceProperty
];

export const CONTROLS = [
    ContentAreaControl,
    ContentReferenceControl,
    ImageReferenceControl,
    CheckboxListControl,
    ObjectListControl
];
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        QuillModule,
        FontAwesomeModule,
        BsDropdownModule,
        CoreModule,
        DndModule
    ],
    declarations: [
        ObjectDetailsComponent,
        ...PROPERTIES,
        ...CONTROLS
    ],
    exports: [
        ...PROPERTIES
    ]
})
export class PropertiesModule {
    static forRoot(): ModuleWithProviders<PropertiesModule> {
        return {
            ngModule: PropertiesModule,
            providers: [
                DynamicFormService,
                { provide: DEFAULT_PROPERTY_FACTORIES, useClass: TextPropertyFactory, multi: true },
                { provide: DEFAULT_PROPERTY_FACTORIES, useClass: TextareaPropertyFactory, multi: true },
                { provide: DEFAULT_PROPERTY_FACTORIES, useClass: CheckboxPropertyFactory, multi: true },
                { provide: DEFAULT_PROPERTY_FACTORIES, useClass: CheckboxListPropertyFactory, multi: true },
                { provide: DEFAULT_PROPERTY_FACTORIES, useClass: DropdownPropertyFactory, multi: true },
                { provide: DEFAULT_PROPERTY_FACTORIES, useClass: ObjectListFactory, multi: true },
                { provide: DEFAULT_PROPERTY_FACTORIES, useClass: XHtmlPropertyFactory, multi: true },
                { provide: DEFAULT_PROPERTY_FACTORIES, useClass: ContentAreaFactory, multi: true },
                { provide: DEFAULT_PROPERTY_FACTORIES, useClass: ContentReferenceFactory, multi: true },
                { provide: DEFAULT_PROPERTY_FACTORIES, useClass: ImagePropertyFactory, multi: true }
            ]
        };
    }
}
