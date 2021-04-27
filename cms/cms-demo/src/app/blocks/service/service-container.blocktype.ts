import { BlockData, BlockType, Property, ValidationTypes, UIHint } from '@typijs/core';
import { ServiceContainerComponent } from './service-container.component';

@BlockType({
    displayName: 'Service Container Block',
    groupName: 'Service',
    componentRef: ServiceContainerComponent
})
export class ServiceContainerBlock extends BlockData {
    @Property({
        displayName: 'Services',
        displayType: UIHint.ContentArea,
        allowedTypes: ['ServiceBlock']
    })
    services: any[];
}
