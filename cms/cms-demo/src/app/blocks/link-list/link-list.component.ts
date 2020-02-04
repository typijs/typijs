import { Component } from '@angular/core';
import { CmsComponent } from '@angular-cms/core';
import { LinkListBlock } from './link-list.blocktype';

@Component({
    templateUrl: 'link-list.component.html'
})

export class LinkListComponent extends CmsComponent<LinkListBlock> {
    constructor() {
        super();
    }
}