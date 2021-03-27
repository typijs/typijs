import { ADMIN_PATH } from '@angular-cms/core';
import { Component, Inject } from '@angular/core';

@Component({
    selector: 'cms-header',
    templateUrl: './cms-header.component.html'
})
export class CmsHeaderComponent {
    constructor(@Inject(ADMIN_PATH) public adminPath: string) { }
}
