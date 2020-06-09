import { Component, ChangeDetectorRef } from '@angular/core';
import { CMS, CmsComponentConfig } from '@angular-cms/core';

import { BaseLayoutComponent } from '../shared/base-layout.component';
import { WidgetService } from '../services/widget.service';

@Component({
    template: `<cms-layout [rightTabs]="rightTabs" [leftTabs]="leftTabs"></cms-layout>`
})
export class EditorComponent extends BaseLayoutComponent {

    constructor(
        _changeDetectionRef: ChangeDetectorRef,
        widgetService: WidgetService) {
        super(_changeDetectionRef, widgetService);
    }

    protected getCmsWidgets(): Array<CmsComponentConfig> {
        return CMS.EDITOR_WIDGETS();
    }
}
