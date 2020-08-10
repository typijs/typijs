import 'reflect-metadata';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from '@angular-cms/core';
import { COLUMNS_METADATA_KEY, COLUMN_METADATA_KEY } from '../../decorators/metadata-key';
import { ColumnMetadata } from '../../decorators/column.decorator';

export type ColumnSettings = ColumnMetadata & {
    name: string
}

export abstract class CrudBaseService<T = unknown> extends BaseService {
    protected apiUrl: string;
    protected abstract modelType: new () => T;
    constructor(http: HttpClient) {
        super(http)
    }

    getColumns(): ColumnSettings[] {
        const columns: Array<string> = Reflect.getMetadata(COLUMNS_METADATA_KEY, this.modelType);
        return columns.map(columnName => ({ name: columnName, ...Reflect.getMetadata(COLUMN_METADATA_KEY, this.modelType, columnName) }))
    }

    findAll(): Observable<T[]> {
        return this.httpClient.get<T[]>(this.apiUrl)
    }
}