import { NgModule, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { CoreModule, setAppInjector } from '@angular-cms/core';

import { SharedModule } from '../shared/shared.module';
import { PageTreeComponent } from './page-tree.component';
import { PageTreeReadonlyComponent } from './page-tree-readonly.component';
import { ContentModule } from '../content/content.module';
import { PageTreeService } from './page-tree.service';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
        ContentModule,
        SharedModule,
        RouterModule
    ],
    declarations: [
        PageTreeComponent,
        PageTreeReadonlyComponent
    ],
    entryComponents: [
        PageTreeComponent,
        PageTreeReadonlyComponent
    ],
    exports: [
        PageTreeComponent,
        PageTreeReadonlyComponent
    ],
    providers: [PageTreeService]
})
export class PageModule {
    constructor(injector: Injector) {
        setAppInjector(injector);
    }
}
