import { CoreModule } from '@angular-cms/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { TableColumnDirective, DynamicTableComponent, TableToolbarDirective } from './dynamic-table.component';

@NgModule({
    imports: [
        CommonModule,
        FontAwesomeModule,
        PaginationModule,

        CoreModule
    ],
    declarations: [
        DynamicTableComponent,
        TableColumnDirective,
        TableToolbarDirective,
    ],
    exports: [
        DynamicTableComponent,
        TableColumnDirective,
        TableToolbarDirective,
    ]
})
export class CmsTableModule {
    constructor(library: FaIconLibrary) {
        library.addIcons(faSortUp, faSortDown);
    }
}
