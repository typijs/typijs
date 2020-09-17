import { BaseService, ISelectionFactory, SelectItem, UIHint } from '@angular-cms/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Column } from '../decorators/column.decorator';
import { Table } from '../decorators/table.decorator';

export type Language = {
    code: string;
    name: string;
    nativeName: string;
};

@Injectable()
export class LanguageSelectionFactory extends BaseService implements ISelectionFactory {
    protected apiUrl: string = `${this.baseApiUrl}/language`;
    constructor(httpClient: HttpClient) {
        super(httpClient);
    }

    getSelectItems(): Observable<SelectItem[]> {
        return this.httpClient.get<Language[]>(`${this.apiUrl}/getAll`).pipe(
            map((languages: Language[]) => languages.map(lang => <SelectItem>{ value: lang.code, text: `${lang.name} (${lang.nativeName})` }))
        );
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
        displayName: 'Hostname'
    })
    siteUrl: string;
    @Column({
        displayName: 'Default Language',
        displayType: UIHint.Dropdown,
        selectionFactory: LanguageSelectionFactory
    })
    language: string;
    @Column()
    isPrimary: boolean;
}
