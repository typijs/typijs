import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CmsBsDropdownModule } from '../shared/ngx-bootstrap/bs-dropdown.module';
import { CmsTabsModule } from '../shared/ngx-bootstrap/tabs.module';

// Import components
import { AppAsideComponent } from './components/app-aside/app-aside.component';
import { AppBreadcrumbsComponent } from './components/app-breadcrumbs/app-breadcrumbs.component';
import { AppFooterComponent } from './components/app-footer/app-footer.component';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { AppSidebarComponent } from './components/app-sidebar/app-sidebar.component';
import { AppSidebarFooterComponent } from './components/app-sidebar-footer/app-sidebar-footer.component';
import { AppSidebarFormComponent } from './components/app-sidebar-form/app-sidebar-form.component';
import { AppSidebarHeaderComponent } from './components/app-sidebar-header/app-sidebar-header.component';
import { AppSidebarMinimizerComponent } from './components/app-sidebar-minimizer/app-sidebar-minimizer.component';
import { APP_SIDEBAR_NAV } from './components/app-sidebar-nav/app-sidebar-nav.component';

const APP_COMPONENTS = [
    AppAsideComponent,
    AppBreadcrumbsComponent,
    AppFooterComponent,
    AppHeaderComponent,
    AppSidebarComponent,
    AppSidebarFooterComponent,
    AppSidebarFormComponent,
    AppSidebarHeaderComponent,
    AppSidebarMinimizerComponent,
    APP_SIDEBAR_NAV
]

// Import directives
import { AsideToggleDirective } from './directives/aside/aside.directive';
import { NAV_DROPDOWN_DIRECTIVES } from './directives/nav-dropdown/nav-dropdown.directive';
import { ReplaceDirective } from './directives/replace/replace.directive';
import { SIDEBAR_TOGGLE_DIRECTIVES } from './directives/sidebar/sidebar.directive';

const APP_DIRECTIVES = [
    AsideToggleDirective,
    NAV_DROPDOWN_DIRECTIVES,
    ReplaceDirective,
    SIDEBAR_TOGGLE_DIRECTIVES
]

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        CmsTabsModule.forRoot(),
        CmsBsDropdownModule.forRoot()
    ],
    declarations: [
        ...APP_COMPONENTS,
        ...APP_DIRECTIVES
    ],
    exports: [
        ...APP_COMPONENTS,
        ...APP_DIRECTIVES
    ]
})
export class LayoutModule { }
