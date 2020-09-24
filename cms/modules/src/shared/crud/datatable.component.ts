import { CmsObject, ContentTypeService } from '@angular-cms/core';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, Directive, EventEmitter, Input, OnInit, Output, QueryList, TemplateRef } from '@angular/core';
import { ColumnMetadata } from '../../decorators/column.decorator';

export interface ColumnSettings extends ColumnMetadata {
    name: string;
}

export type ColumnTemplate = {
    cellTemplate: TemplateRef<any>;
    headerTemplate: TemplateRef<any>;
};

export type ColumnTemplateDictionary = {
    [key: string]: ColumnTemplate
};

@Directive({ selector: 'cms-table-column' })
export class DataTableColumnDirective {
    @Input() name: string;
    @ContentChild('cellTemplate', { static: true }) cellTemplate: TemplateRef<any>;
    @ContentChild('headerTemplate', { static: true }) headerTemplate: TemplateRef<any>;
}

@Component({
    selector: 'cms-table',
    templateUrl: 'datatable.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent implements OnInit {
    @Input() modelType: new () => any;
    @Input() rows: CmsObject[];

    @Output() rowClick: EventEmitter<CmsObject> = new EventEmitter<CmsObject>();

    @ContentChildren(DataTableColumnDirective)
    set columnDirectives(val: QueryList<DataTableColumnDirective>) {
        this._columnDirectives = val;
        this.columnTemplates = this.translateColumns(val);
    }
    get columnDirectives(): QueryList<DataTableColumnDirective> {
        return this._columnDirectives;
    }

    columns: ColumnSettings[];
    columnTemplates: ColumnTemplateDictionary;

    private _columnDirectives: QueryList<DataTableColumnDirective>;
    constructor(private contentTypeService: ContentTypeService, private changeDetectionRef: ChangeDetectorRef) { }

    ngOnInit() {
        this.columns = this.contentTypeService.getContentTypeProperties(this.modelType).map(x => ({ name: x.name, ...x.metadata }));
    }

    translateColumns(val: QueryList<DataTableColumnDirective>): ColumnTemplateDictionary {
        const result: ColumnTemplateDictionary = {};
        if (val) {
            const arr = val.toArray();
            if (arr.length) {
                arr.forEach(col => {
                    result[col.name] = {
                        cellTemplate: col.cellTemplate,
                        headerTemplate: col.headerTemplate
                    };
                });
                this.changeDetectionRef.markForCheck();
            }
        }
        return result;
    }
}
