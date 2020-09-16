import { ISelectionFactory, SelectItem, UIHint } from '@angular-cms/core';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Column } from '../decorators/column.decorator';
import { Table } from '../decorators/table.decorator';

@Injectable()
export class SiteDefinitionSelectionFactory implements ISelectionFactory {
    getSelectItems(): Observable<SelectItem[]> {
        return of([{
            text: 'Is Primary Host',
            value: true
        }]);
    }
}

@Table({
    displayName: 'Site Management',
    description: 'Configuration for site'
})
export class SiteDefinition {
    _id: string;
    @Column({
        displayName: 'Start Page',
        displayType: UIHint.ContentReference
    })
    startPage: string;
    @Column({
        displayName: 'Site Hostname',
        displayType: UIHint.Text
    })
    siteUrl: string;
    @Column({
        displayName: 'Default Language',
        displayType: UIHint.Text
    })
    language: string;
    @Column({
        displayName: 'Is Primary',
        displayType: UIHint.Checkbox,
        selectionFactory: SiteDefinitionSelectionFactory
    })
    isPrimary: boolean;
}
