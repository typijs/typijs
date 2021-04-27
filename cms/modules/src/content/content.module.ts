import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CoreModule } from '@typijs/core';
import { AngularSplitModule } from 'angular-split';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ContentCreateComponent } from './content-create/content-create.component';
import { ContentCrudServiceResolver } from './content-crud.service';
import { ContentBreadcrumbComponent } from './content-update/content-breadcrumb.component';
import { ContentHeaderComponent } from './content-update/content-header.component';
import { ContentSettingsComponent } from './content-update/content-settings.component';
import { ContentToolbarComponent } from './content-update/content-toolbar.component';
import { ContentUpdateComponent } from './content-update/content-update.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        FontAwesomeModule,

        AngularSplitModule,
        ButtonsModule,
        TabsModule,

        CoreModule
    ],
    declarations: [
        ContentUpdateComponent,
        ContentCreateComponent,
        ContentToolbarComponent,
        ContentSettingsComponent,
        ContentHeaderComponent,
        ContentBreadcrumbComponent
    ],
    exports: [
        ContentUpdateComponent,
        ContentCreateComponent
    ]
})
export class ContentModule {
    static forRoot(): ModuleWithProviders<ContentModule> {
        return {
            ngModule: ContentModule,
            providers: [ContentCrudServiceResolver]
        };
    }
}
