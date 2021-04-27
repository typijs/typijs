import { ADMIN_ROUTE } from '@typijs/core';
import { Component, Inject } from '@angular/core';

@Component({
    selector: 'cms-header',
    templateUrl: './cms-header.component.html'
})
export class CmsHeaderComponent {
    constructor(@Inject(ADMIN_ROUTE) public adminPath: string) { }
}
