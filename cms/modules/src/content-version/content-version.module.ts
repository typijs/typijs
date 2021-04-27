import { CmsWidgetPosition, CoreModule, EDITOR_WIDGETS } from '@typijs/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CmsTableModule } from '../shared/table/table.module';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ContentVersionComponent } from './content-version.component';
import { ContentVersionServiceResolver } from './content-version.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FontAwesomeModule,

        ButtonsModule,
        TabsModule,

        CoreModule,
        CmsTableModule
    ],
    declarations: [
        ContentVersionComponent
    ]
})
export class ContentVersionModule {
    static forRoot(): ModuleWithProviders<ContentVersionModule> {
        return {
            ngModule: ContentVersionModule,
            providers: [
                ContentVersionServiceResolver,
                {
                    provide: EDITOR_WIDGETS, useValue: { group: 'Pages', position: CmsWidgetPosition.Left, component: ContentVersionComponent, order: 50, isSplit: true },
                    multi: true
                },
            ]
        };
    }
}
