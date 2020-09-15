import { Component, OnInit } from '@angular/core';
import { SiteDefinitionService } from './site-definition.service';
import { SiteDefinition } from './site-definition.model';
import { Observable } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';


@Component({
    template: `
    <p  [routerLink]="['site-manage']">Manage Websites</p>
    `
})
export class SiteDefinitionMenuComponent { }

@Component({
    template: `
    <div class="row">
        <div class="col-12">
            <cms-table [modelType]="modelType"
                    [rows]="siteDefinitions$ | async"
                    (rowClick)="editSiteDefinition($event)"></cms-table>
        </div>
    </div>
  `
})
export class SiteDefinitionListComponent implements OnInit {
    modelType: new () => any = SiteDefinition;
    siteDefinitions$: Observable<SiteDefinition[]>;

    constructor(private service: SiteDefinitionService, private router: Router, private route: ActivatedRoute) { }
    ngOnInit(): void {
        this.siteDefinitions$ = this.service.getAllSiteDefinitions();
    }

    editSiteDefinition(site: SiteDefinition) {
        this.router.navigate(['../site-manage', site._id], { relativeTo: this.route });
    }
}

@Component({
    template: `
    <div class="row">
        <div class="col-12">
            <cms-form [modelType]="modelType"
                    [formData]="siteDefinition$ | async"></cms-form>
        </div>
    </div>
  `
})
export class SiteDefinitionDetailComponent implements OnInit {
    modelType: new () => any = SiteDefinition;
    siteDefinition$: Observable<SiteDefinition>;

    constructor(private service: SiteDefinitionService, private route: ActivatedRoute) { }
    ngOnInit(): void {
        this.siteDefinition$ = this.route.params
            .pipe(
                switchMap((params: Params) => this.service.getSiteDefinition(params.id))
            );
    }
}

