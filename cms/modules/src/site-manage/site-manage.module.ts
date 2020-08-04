import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SiteManageComponent, SiteManageEntryComponent } from './site-manage.component';
import { SiteManageService } from './site-manage.service';
import { CrudModule } from '../shared/crud/crud.module';
import { CrudBaseService } from '../shared/crud/crud.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,

        CrudModule
    ],
    declarations: [
        SiteManageComponent,
        SiteManageEntryComponent
    ],
    entryComponents: [
        SiteManageComponent,
        SiteManageEntryComponent
    ],
    exports: [
        SiteManageComponent,
        SiteManageEntryComponent
    ],
    providers: [SiteManageService, { provide: CrudBaseService, useExisting: SiteManageService }]
})
export class SiteManageModule { }
