import { ClassOf } from '@typijs/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SiteDefinition } from './site-definition.model';
import { SiteDefinitionService } from './site-definition.service';

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
                    (rowClick)="editSiteDefinition($event)">
                <!-- Toolbar Template -->
                <cms-table-toolbar>
                    <ng-template #toolbarTemplate let-rows="rows">
                        <button type="button" class="btn btn-primary" (click)="addSiteDefinition()">Add</button>
                    </ng-template>
                </cms-table-toolbar>
                <!-- Column Template -->
                <cms-table-column name="siteUrl">
                    <ng-template #cellTemplate let-value="value">
                        <a [href]="value" target="_blank">{{value}}</a>
                    </ng-template>
                </cms-table-column>
            </cms-table>
        </div>
    </div>
  `
})
export class SiteDefinitionListComponent implements OnInit {
    modelType: ClassOf<SiteDefinition> = SiteDefinition;
    siteDefinitions$: Observable<SiteDefinition[]>;

    constructor(private service: SiteDefinitionService, private router: Router, private route: ActivatedRoute) { }
    ngOnInit(): void {
        this.siteDefinitions$ = this.service.findAll().pipe(
            map(sites => sites.map(site => new SiteDefinition(site)))
        );
    }

    addSiteDefinition() {
        this.router.navigate(['../site-manage', 'new'], { relativeTo: this.route });
    }

    editSiteDefinition(site: SiteDefinition) {
        this.router.navigate(['../site-manage', site._id], { relativeTo: this.route });
    }
}

@Component({
    template: `
    <div class="row">
        <div class="col-12">
            <cms-form
                #formId="cmsForm"
                [modelType]="modelType"
                [model]="siteDefinition$ | async"
                (ngSubmit)="onSubmit($event)">
                <div class="d-flex align-items-center">
                    <button type="button" class="btn btn-default ml-auto mr-1" (click)="backToList()">Cancel</button>
                    <button type="button" class="btn btn-primary" (click)="formId.submit()">Save</button>
                </div>
            </cms-form>
        </div>
    </div>
  `
})
export class SiteDefinitionDetailComponent implements OnInit {
    modelType: ClassOf<SiteDefinition> = SiteDefinition;
    siteDefinition$: Observable<SiteDefinition>;

    constructor(private service: SiteDefinitionService, private router: Router, private route: ActivatedRoute) { }
    ngOnInit(): void {
        this.siteDefinition$ = this.route.params
            .pipe(
                switchMap((params: Params) => params.id !== 'new' ? this.service.findOne(params.id) : of(<SiteDefinition>{})),
                map(site => new SiteDefinition(site))
            );
    }

    onSubmit(value: SiteDefinition) {
        value.startPage = value.startPage?.id;
        if (value._id) {
            this.service.update(value._id, value).subscribe(() => this.backToList());
        } else {
            this.service.save(value).subscribe(() => this.backToList());
        }
    }

    backToList() {
        this.router.navigate(['../'], { relativeTo: this.route });
    }
}

