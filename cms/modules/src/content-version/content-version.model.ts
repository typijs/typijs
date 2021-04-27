import { Column } from '../shared/table/column.decorator';

export class ContentVersionModel {
    _id: string;
    contentId: string;
    @Column({
        header: 'Language'
    })
    language: string;
    @Column({
        header: 'Status',
    })
    status: string;
    @Column({
        header: 'Saved'
    })
    savedAt: string;
    @Column({
        header: 'By'
    })
    savedBy: string;
}
