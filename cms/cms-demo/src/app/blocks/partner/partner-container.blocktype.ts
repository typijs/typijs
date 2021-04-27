import { BlockData, BlockType, Property, ValidationTypes, UIHint } from '@typijs/core';
import { PartnerContainerComponent } from './partner-container.component';

@BlockType({
    displayName: 'Partner Container Block',
    groupName: 'Partner',
    componentRef: PartnerContainerComponent
})
export class PartnerContainerBlock extends BlockData {
    @Property({
        displayName: 'Partners',
        displayType: UIHint.ContentArea,
        allowedTypes: ['PartnerBlock']
    })
    partners: any[];
}
