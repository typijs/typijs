import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, Directive, EventEmitter, Input, OnInit, Output, QueryList, TemplateRef } from '@angular/core';
import { ClassOf, CmsObject } from '@typijs/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { SubscriptionDestroy } from '../subscription-destroy';
import { ColumnMetadata, COLUMNS_METADATA_KEY, COLUMN_METADATA_KEY } from './column.decorator';

export interface ColumnSettings extends ColumnMetadata {
    name: string;
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

/**
 * Directive
 * ```html
 * <cms-table-column name="siteUrl">
        <ng-template #cellTemplate let-value="value">
            <a [href]="value" target="_blank">{{value}}</a>
        </ng-template>
    </cms-table-column>

   <cms-table-column name="name">
        <ng-template #headerTemplate let-column="column">
            <fa-icon [icon]="['fas', 'language']"></fa-icon>
            {{column.displayName}}
        </ng-template>
    </cms-table-column>
 * ```
 */
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
    @Input() modelType: ClassOf<any>;
    @Input() rows: CmsObject[];

    /**
     * The total number items
     */
    @Input() totalItems: number;

    /**
     * The page size
     */
    @Input() itemsPerPage: number = 10;

    /**
     * The current page number
     */
    @Input() currentPage: number = 1;

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
    pageSize$: BehaviorSubject<number> = new BehaviorSubject(this.itemsPerPage);
    pageNumber$: BehaviorSubject<number> = new BehaviorSubject(this.currentPage);

    private _columnDirectives: QueryList<TableColumnDirective>;
    constructor(private changeDetectionRef: ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        this.columns = this.getColumnsMetadata(this.modelType);

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
        this.columns.filter(x => x.name !== column.name).forEach(x => { x.sortable = false; x.desc = false; });
        column.desc = column.sortable ? !column.desc : false;
        column.sortable = true;
        // this.changeDetectionRef.markForCheck();
        this.sortColumn$.next(column);
    }

    /**
     * Gets content type properties
     * @param modelTarget The class contains the properties which are decorate with @Column
     * @returns content type properties
     */
    private getColumnsMetadata(modelTarget: any): ColumnSettings[] {
        const properties: string[] = [];
        let target = modelTarget;
        // walk up the property chain to get all base class fields
        while (target !== Object.prototype) {
            const childFields = Reflect.getOwnMetadata(COLUMNS_METADATA_KEY, target) || [];
            properties.push(...childFields);
            target = Object.getPrototypeOf(target);
        }

        return properties.map(propertyName => ({
            name: propertyName,
            ...Reflect.getMetadata(COLUMN_METADATA_KEY, modelTarget, propertyName)
        }));
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
