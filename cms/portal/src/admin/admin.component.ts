import { ADMIN_WIDGETS, CmsComponentConfig } from '@angular-cms/core';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { WidgetService } from '../services/widget.service';
import { BaseLayoutComponent } from '../shared/base-layout.component';

@Component({
    template: `<cms-layout [rightTabs]="rightTabs" [leftTabs]="leftTabs"></cms-layout>`
})
export class AdminComponent extends BaseLayoutComponent {

    constructor(
        _changeDetectionRef: ChangeDetectorRef,
        widgetService: WidgetService,
        @Inject(ADMIN_WIDGETS) adminWidgets: CmsComponentConfig[]) {
        super(_changeDetectionRef, widgetService, adminWidgets);
    }
}
