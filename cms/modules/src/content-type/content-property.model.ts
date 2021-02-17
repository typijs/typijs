import { UIHint } from '@angular-cms/core';
import { Column } from '../decorators/column.decorator';

export class ContentPropertyModel {
    @Column({
        displayName: 'Name',
        displayType: UIHint.Text
    })
    name: string;
    @Column({
        displayName: 'Display Name',
        displayType: UIHint.Text
    })
    displayName?: string;
    @Column({
        displayName: 'Description',
        displayType: UIHint.Text
    })
    description?: string;
    @Column({
        displayName: 'UI Type',
        displayType: UIHint.Text
    })
    displayType?: string;
    @Column({
        displayName: 'Property Type',
        displayType: UIHint.Text
    })
    propertyType: string;
}
