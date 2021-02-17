import { BlockData, BlockType, CmsImage, ISelectionFactory, Property, SelectItem, UIHint } from '@angular-cms/core';
import { Observable, of } from 'rxjs';
import { ServiceComponent } from './service.component';


export class IconSelectionFactory implements ISelectionFactory {
    getSelectItems(): Observable<SelectItem[]> {
        return of([
            { value: 'flaticon-shipped', text: 'Shipping' },
            { value: 'flaticon-diet', text: 'Diet' },
            { value: 'flaticon-award', text: 'Award' },
            { value: 'flaticon-customer-service', text: 'Customer Service' }
        ])
    }
}

export class BackgroundSelectionFactory implements ISelectionFactory {
    getSelectItems(): Observable<SelectItem[]> {
        return of([
            { value: 'bg-color-1', text: 'Purple' },
            { value: 'bg-color-2', text: 'Orange' },
            { value: 'bg-color-3', text: 'Light Blue' },
            { value: 'bg-color-4', text: 'Yellow' }
        ])
    }
}

@BlockType({
    displayName: 'Service Block',
    groupName: 'Service',
    componentRef: ServiceComponent
})
export class ServiceBlock extends BlockData {
    @Property({
        displayName: 'Heading',
        displayType: UIHint.Text
    })
    heading: string;

    @Property({
        displayName: 'Subheading',
        displayType: UIHint.Textarea
    })
    subheading: string;

    @Property({
        displayName: 'Icon',
        displayType: UIHint.Dropdown,
        selectionFactory: IconSelectionFactory
    })
    icon: string;

    @Property({
        displayName: 'Background',
        displayType: UIHint.Dropdown,
        selectionFactory: BackgroundSelectionFactory
    })
    background: string;
}
