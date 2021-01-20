import { CmsComponentConfig, EDITOR_WIDGETS } from '@angular-cms/core';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { WidgetService } from '../services/widget.service';
import { BaseLayoutComponent } from '../shared/base-layout.component';

@Component({
    template: `<cms-layout [rightTabs]="rightTabs" [leftTabs]="leftTabs"></cms-layout>`
})
export class EditorComponent extends BaseLayoutComponent {

    constructor(
        _changeDetectionRef: ChangeDetectorRef,
        widgetService: WidgetService,
        @Inject(EDITOR_WIDGETS) editorWidgets: CmsComponentConfig[],) {
        super(_changeDetectionRef, widgetService, editorWidgets);
    }
}
