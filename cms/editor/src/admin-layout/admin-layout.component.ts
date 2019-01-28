import { Component, ViewEncapsulation, ChangeDetectorRef, ViewChild, QueryList, ComponentFactoryResolver, Injector, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

import { CmsLayoutComponent } from './../shared/cms-layout.component';
import { BaseLayoutComponent } from './../base-layout.component';

import {
    CMS,
    InsertPointDirective,
    ContentService,
    CmsComponentConfig,
    CmsWidgetPosition,
    CmsTab,
    sortTabByTitle
} from '@angular-cms/core';

import { WidgetService } from '../services/widget.service';

@Component({
    template: `<cms-layout [rightTabs]="rightTabs" [leftTabs]="leftTabs"></cms-layout>`
})
export class AdminLayoutComponent extends BaseLayoutComponent {

    constructor(
        _changeDetectionRef: ChangeDetectorRef,
        widgetService: WidgetService) {
        super(_changeDetectionRef, widgetService);
    }

    protected getCmsWidgets(): Array<CmsComponentConfig>{
        return CMS.ADMIN_WIDGETS();
    }
}
