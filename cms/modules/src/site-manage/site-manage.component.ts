import { Component, OnInit } from '@angular/core';
import { SiteManageService } from './site-manage.service';
import { SiteDefinition } from './site-manage.model';
import { Observable } from 'rxjs';

@Component({
    template: `
    <div class="row">
        <div class="col-12">
            <cms-table [modelType]="modelType" [rows]="siteDefinitions | async"></cms-table>
        </div>
    </div>
  `
})
export class SiteManageComponent implements OnInit {
    modelType: new () => any = SiteDefinition;
    siteDefinitions: Observable<SiteDefinition[]>;

    constructor(private service: SiteManageService) { }
    ngOnInit(): void {
        this.siteDefinitions = this.service.getAllSiteDefinitions();
    }
}


@Component({
    template: `
    <p  [routerLink]="['site-manage']">Manage Websites</p>
    `
})
export class SiteManageMenuComponent {
}
