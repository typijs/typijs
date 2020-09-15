import { ContentTypeService, CmsObject } from '@angular-cms/core';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ColumnMetadata } from '../../decorators/column.decorator';

export interface ColumnSettings extends ColumnMetadata {
    name: string;
}

@Component({
    selector: 'cms-table',
    templateUrl: 'datatable.component.html'
})
export class DataTableComponent implements OnInit {
    @Input() modelType: new () => any;
    @Input() rows: CmsObject[];

    @Output() rowClick: EventEmitter<CmsObject> = new EventEmitter<CmsObject>();
    columns: ColumnSettings[];
    constructor(private contentTypeService: ContentTypeService) { }

    ngOnInit() {
        this.columns = this.contentTypeService.getContentTypeProperties(this.modelType).map(x => ({ name: x.name, ...x.metadata }));
    }
}
