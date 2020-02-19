import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Injector, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFile, faFolder, faSitemap } from '@fortawesome/free-solid-svg-icons';

import { CoreModule, setAppInjector } from '@angular-cms/core';

import { ContentModule } from '../content/content.module';
import { DndModule } from '../shared/dnd/dnd.module';
import { TreeModule } from '../shared/tree/tree.module';

import { PageTreeReadonlyComponent } from './page-tree-readonly.component';
import { PageTreeComponent } from './page-tree.component';
import { PageTreeService } from './page-tree.service';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        FontAwesomeModule,

        CoreModule,
        ContentModule,
        TreeModule,
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
