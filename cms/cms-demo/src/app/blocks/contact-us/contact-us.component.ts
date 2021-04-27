import { Component } from '@angular/core';
import { CmsComponent } from '@typijs/core';
import { ContactUsBlock } from './contact-us.blocktype';

@Component({
    templateUrl: 'contact-us.component.html'
})

export class ContactUsComponent extends CmsComponent<ContactUsBlock> {
    constructor() {
        super();
    }
}
