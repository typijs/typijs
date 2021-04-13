import { Column } from '../shared/table/column.decorator';
export class ContentPropertyModel {
    @Column({
        header: 'Name'
    })
    name: string;
    @Column({
        header: 'Display Name'
    })
    header?: string;
    @Column({
        header: 'Description'
    })
    description?: string;
    @Column({
        header: 'UI Type'
    })
    displayType?: string;
    @Column({
        header: 'Property Type'
    })
    propertyType: string;
}
