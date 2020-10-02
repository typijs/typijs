import { CoreModule } from '@angular-cms/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';

import { PropertiesModule } from '../../properties/properties.module';
import { TableColumnDirective, DynamicTableComponent, TableToolbarDirective } from './dynamic-table.component';
import { DynamicFormComponent } from './dynamic-form.component';
import { DynamicTablePagerComponent } from './pager.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,

        CoreModule,
        PropertiesModule
    ],
    declarations: [
        DynamicTablePagerComponent,
        DynamicTableComponent,
        TableColumnDirective,
        TableToolbarDirective,
        DynamicFormComponent
    ],
    exports: [
        DynamicTableComponent,
        TableColumnDirective,
        TableToolbarDirective,
        DynamicFormComponent
    ]
})
export class CrudModule {
    constructor(library: FaIconLibrary) {
        library.addIcons(faSortUp, faSortDown);
    }
}
