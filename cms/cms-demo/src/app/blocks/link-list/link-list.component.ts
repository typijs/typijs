import { Component } from '@angular/core';
import { CmsComponent } from '@typijs/core';
import { LinkListBlock } from './link-list.blocktype';

@Component({
    templateUrl: 'link-list.component.html'
})

export class LinkListComponent extends CmsComponent<LinkListBlock> {
    constructor() {
        super();
    }
}
