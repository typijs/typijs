import { CmsComponent, PageService } from '@angular-cms/core';
import { Component } from '@angular/core';
import { StandardPage } from './standard.pagetype';

@Component({
    templateUrl: 'standard.component.html'
})
export class StandardPageComponent extends CmsComponent<StandardPage> {
    constructor(private contentService: PageService) {
        super();
    }
}
