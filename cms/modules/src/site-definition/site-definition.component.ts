import { ClassOf } from '@angular-cms/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
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
                <cms-table-toolbar>
                    <ng-template #toolbarTemplate let-rows="rows">
                        <button type="button" class="btn btn-primary">Add</button>
                    </ng-template>
                </cms-table-toolbar>
                <!-- Column Template -->
                <cms-table-column name="siteUrl">
                    <ng-template #cellTemplate let-value="value">
                        <a [href]="value" target="_blank">{{value}}</a>
                    </ng-template>
                </cms-table-column>
                <cms-table-column name="language">
                    <ng-template #headerTemplate let-column="column">
                        <fa-icon [icon]="['fas', 'language']"></fa-icon>
                        {{column.displayName}}
                    </ng-template>
                </cms-table-column>
                <cms-table-column name="isPrimary">
                    <ng-template #cellTemplate let-row="row" let-column="column" let-value="value">
                        <fa-icon *ngIf="value" [icon]="['fas', 'check']"></fa-icon>
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
            tap(sites => sites.forEach(x => x.startPage = x.startPage.name))
        );
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
                    [model]="siteDefinition$ | async"
                    (ngSubmit)="onSubmit($event)"></cms-form>
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
                switchMap((params: Params) => this.service.findOne(params.id)),
                tap(site => site.startPage = {
                    id: site.startPage._id,
                    type: 'page',
                    name: site.startPage.name,
                    contentType: site.startPage.contentType
                })
            );
    }

    onSubmit(value: SiteDefinition) {
        if (value.startPage) {
            value.startPage = value.startPage.id;
        }
        this.service.update(value._id, value).subscribe(() => {
            this.router.navigate(['../'], { relativeTo: this.route });
        });
    }
}

