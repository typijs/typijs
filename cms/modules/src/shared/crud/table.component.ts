import { Component, OnInit } from '@angular/core';
import { CrudBaseService, ColumnSettings } from './crud.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'crud-table',
    templateUrl: 'table.component.html'
})
export class TableComponent implements OnInit {
    columns: ColumnSettings[];
    items$: Observable<any>;

    constructor(private crudService: CrudBaseService) {
        this.columns = this.crudService.getColumns();
    }

    ngOnInit() {
        this.items$ = this.crudService.findAll();
    }
}