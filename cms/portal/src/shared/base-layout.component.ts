import { ChangeDetectorRef, OnInit, QueryList, ViewChild } from '@angular/core';

import { CmsComponentConfig, CmsTab, CmsWidgetPosition, InsertPointDirective } from '@angular-cms/core';

import { WidgetService } from '../services/widget.service';
import { CmsLayoutComponent } from './components/cms-layout/cms-layout.component';

export abstract class BaseLayoutComponent implements OnInit {
    @ViewChild(CmsLayoutComponent, { static: false }) private cmsLayout: CmsLayoutComponent;

    private insertPoints: QueryList<InsertPointDirective>;
    private componentRefs: Array<any> = [];
    private cmsWidgets: Array<CmsComponentConfig> = [];

    rightTabs: Array<CmsTab> = [];
    leftTabs: Array<CmsTab> = [];

    constructor(private _changeDetectionRef: ChangeDetectorRef, private widgetService: WidgetService) {
        this.cmsWidgets = this.getCmsWidgets();
    }

    protected abstract getCmsWidgets(): Array<CmsComponentConfig>;

    private initRightWidgetTabs(): Array<CmsTab> {
        return this.widgetService.initWidgetTab(this.cmsWidgets, CmsWidgetPosition.Right);
    }

    private initLeftWidgetTabs(): Array<CmsTab> {
        return this.widgetService.initWidgetTab(this.cmsWidgets, CmsWidgetPosition.Left);
    }

    private creatingWidgets(): Array<any> {
        let componentRefs = [];
        componentRefs.push(...this.widgetService.initWidgets(this.cmsWidgets, this.insertPoints, this.rightTabs, CmsWidgetPosition.Right));
        componentRefs.push(...this.widgetService.initWidgets(this.cmsWidgets, this.insertPoints, this.leftTabs, CmsWidgetPosition.Left));
        return componentRefs;
    }

    ngOnInit() {
        this.rightTabs = this.initRightWidgetTabs()
        this.leftTabs = this.initLeftWidgetTabs();
    }

    ngAfterViewInit() {
        this.insertPoints = this.cmsLayout.insertPoints;
        this.componentRefs = this.creatingWidgets();
        this._changeDetectionRef.detectChanges();
    }

    ngOnDestroy() {
        if (this.componentRefs) {
            this.componentRefs.forEach(cmpref => {
                cmpref.destroy();
            })
            this.componentRefs = [];
        }
    }
}
