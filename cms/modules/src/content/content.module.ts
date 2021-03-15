import { CoreModule } from '@angular-cms/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularSplitModule } from 'angular-split';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ContentCreateComponent } from './content-create/content-create.component';
import { ContentCrudServiceResolver } from './content-crud.service';
import { ContentUpdateComponent } from './content-update/content-update.component';
import { ContentToolbarComponent } from './content-update/content-toolbar.component';
import { ContentSettingsComponent } from './content-update/content-settings.component';
import { ContentHeaderComponent } from './content-update/content-header.component';
import { ContentBreadcrumbComponent } from './content-update/content-breadcrumb.component';

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
