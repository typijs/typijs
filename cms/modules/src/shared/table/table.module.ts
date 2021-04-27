import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { CoreModule } from '@typijs/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { DynamicTableComponent, TableColumnDirective, TableToolbarDirective } from './dynamic-table.component';


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
