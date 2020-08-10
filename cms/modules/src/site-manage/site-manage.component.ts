import { Component } from '@angular/core';
import { SiteManageService } from './site-manage.service';

@Component({
    template: `
    <div class="row">
        <div class="col-12">
            <crud-table></crud-table>
        </div>
    </div>
  `
})
export class SiteManageComponent {
    constructor(private service: SiteManageService) { }
}


@Component({
    template: `
    <p  [routerLink]="['site-manage']">Manage Websites</p>
    `
})
export class SiteManageEntryComponent {
}
