import { Component, ChangeDetectorRef } from '@angular/core';
import { BaseLayoutComponent } from './../base-layout.component';

import { CMS, CmsComponentConfig } from '@angular-cms/core';

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

    protected getCmsWidgets(): Array<CmsComponentConfig> {
        return CMS.ADMIN_WIDGETS();
    }
}
