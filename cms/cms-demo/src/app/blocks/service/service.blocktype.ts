import { BlockData, BlockType, CmsImage, Property, UIHint } from '@angular-cms/core';
import { ServiceComponent } from './service.component';

@BlockType({
    displayName: 'Service Block',
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
        displayType: UIHint.Text
    })
    subheading: string;

    @Property({
        displayName: 'Icon',
        displayType: UIHint.Text
    })
    icon: string;
}
