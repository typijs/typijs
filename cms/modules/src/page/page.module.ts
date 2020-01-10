import { NgModule, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CoreModule, setAppInjector, DndModule } from '@angular-cms/core';

import { SharedModule } from '../shared/shared.module';
import { PageTreeComponent } from './page-tree.component';
import { PageTreeReadonlyComponent } from './page-tree-readonly.component';
import { ContentModule } from '../content/content.module';
import { PageTreeService } from './page-tree.service';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faFolder, faFile, faSitemap } from '@fortawesome/free-solid-svg-icons';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        CoreModule,
        ContentModule,
        SharedModule,
        RouterModule,
        DndModule
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
    constructor(private injector: Injector, private library: FaIconLibrary) {
        setAppInjector(injector);
        library.addIcons(faFolder, faSitemap, faFile);
    }
}
