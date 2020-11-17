import { UIHint } from '@angular-cms/core';
import { Column } from '../decorators/column.decorator';

export class ContentVersionModel {
    _id: string;
    versionId: string;
    @Column({
        displayName: 'Language'
    })
    language: string;
    @Column({
        displayName: 'Status',
        displayType: UIHint.Text
    })
    status: string;
    @Column({
        displayName: 'Saved'
    })
    savedAt: string;
    @Column({
        displayName: 'By'
    })
    savedBy: string;
}
