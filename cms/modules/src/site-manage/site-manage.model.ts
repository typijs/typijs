import { UIHint } from '@angular-cms/core';
import { Table } from '../decorators/table.decorator';
import { Column } from '../decorators/column.decorator';

@Table({
    displayName: 'Site Management',
    description: 'Configuration for site'
})
export class SiteManage {
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
        displayType: UIHint.Checkbox
    })
    isPrimary: boolean;
}
