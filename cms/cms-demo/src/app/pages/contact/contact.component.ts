import { Component } from '@angular/core';
import { CmsComponent } from '@typijs/core';
import { ContactPage } from './contact.pagetype';

@Component({
    selector: '[contact-page]',
    templateUrl: './contact.component.html',
})
export class ContactComponent extends CmsComponent<ContactPage> {
    constructor() {
        super();
    }
}
