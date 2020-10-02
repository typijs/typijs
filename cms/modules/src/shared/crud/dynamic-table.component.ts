import { CmsObject, ContentTypeService } from '@angular-cms/core';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, Directive, EventEmitter, Input, OnInit, Output, QueryList, TemplateRef } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ColumnMetadata } from '../../decorators/column.decorator';
import { SubscriptionDestroy } from '../subscription-destroy';

export interface ColumnSettings extends ColumnMetadata {
    name: string;
    sort?: boolean;
    desc?: boolean;
}

export type ColumnTemplate = {
    cellTemplate: TemplateRef<any>;
    headerTemplate: TemplateRef<any>;
};

export type ColumnTemplateDictionary = {
    [key: string]: ColumnTemplate
};

export type TableChangeEvent = {
    keyword?: string;
    sortColumn?: ColumnSettings;
    pageSize?: number;
    page?: number;
};

@Directive({ selector: 'cms-table-column' })
export class TableColumnDirective {
    @Input() name: string;
    @ContentChild('cellTemplate', { static: true }) cellTemplate: TemplateRef<any>;
    @ContentChild('headerTemplate', { static: true }) headerTemplate: TemplateRef<any>;
}

@Directive({ selector: 'cms-table-toolbar' })
export class TableToolbarDirective {
    @ContentChild('toolbarTemplate', { static: true }) template: TemplateRef<any>;
}

@Component({
    selector: 'cms-table',
    templateUrl: 'dynamic-table.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicTableComponent extends SubscriptionDestroy implements OnInit {
    @Input() modelType: new () => any;
    @Input() rows: CmsObject[];

    /**
     * The total number items
     */
    @Input() count: number;

    /**
     * The page size
     */
    @Input() pageSize: number = 10;

    /**
     * The current page number
     */
    @Input() page: number = 1;

    @Output() rowClick: EventEmitter<CmsObject> = new EventEmitter();
    @Output() change: EventEmitter<TableChangeEvent> = new EventEmitter();

    @ContentChild(TableToolbarDirective, { static: true }) toolbarDirective: TableToolbarDirective;
    @ContentChildren(TableColumnDirective)
    get columnDirectives(): QueryList<TableColumnDirective> {
        return this._columnDirectives;
    }
    set columnDirectives(val: QueryList<TableColumnDirective>) {
        this._columnDirectives = val;
        this.columnTemplates = this.translateColumns(val);
    }

    columns: ColumnSettings[];
    columnTemplates: ColumnTemplateDictionary;

    keyword$: BehaviorSubject<string> = new BehaviorSubject('');
    sortColumn$: BehaviorSubject<ColumnSettings> = new BehaviorSubject({ name: '' });
    pageSize$: BehaviorSubject<number> = new BehaviorSubject(this.pageSize);
    pageNumber$: BehaviorSubject<number> = new BehaviorSubject(this.page);

    private _columnDirectives: QueryList<TableColumnDirective>;
    constructor(private contentTypeService: ContentTypeService, private changeDetectionRef: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        this.columns = this.contentTypeService.getContentTypeProperties(this.modelType).map(x => ({ name: x.name, ...x.metadata }));
        const query$ = this.keyword$.pipe(
            debounceTime(500),
            distinctUntilChanged()
        );
        combineLatest(query$, this.sortColumn$, this.pageSize$, this.pageNumber$).pipe(
            takeUntil(this.unsubscribe$)
        ).subscribe(([keyword, sortColumn, pageSize, page]) => {
            this.change.emit({ keyword, sortColumn, pageSize, page });
        });
    }

    sort(column: ColumnSettings) {
        this.columns.filter(x => x.name !== column.name).forEach(x => { x.sort = false; x.desc = false; });
        column.desc = column.sort ? !column.desc : false;
        column.sort = true;
        //this.changeDetectionRef.markForCheck();
        this.sortColumn$.next(column);
    }

    private translateColumns(val: QueryList<TableColumnDirective>): ColumnTemplateDictionary {
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
