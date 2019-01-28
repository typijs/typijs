import { Input, ViewEncapsulation, ViewChildren, Component, QueryList } from '@angular/core';

import { CmsTab, InsertPointDirective } from '@angular-cms/core';

@Component({
    selector: 'cms-layout',
    templateUrl: './cms-layout.component.html',
    styleUrls: ['./cms-layout.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CmsLayoutComponent {
    @ViewChildren(InsertPointDirective) insertPoints: QueryList<InsertPointDirective>;

    @Input() rightTabs: Array<CmsTab> = [];
    @Input() leftTabs: Array<CmsTab> = [];

}
