import { ChangeDetectorRef, OnInit, QueryList, ViewChild, ComponentRef } from '@angular/core';

import { CmsComponentConfig, CmsTab, CmsWidgetPosition, InsertPointDirective } from '@angular-cms/core';

import { WidgetService } from '../services/widget.service';
import { CmsLayoutComponent } from './components/cms-layout/cms-layout.component';

export abstract class BaseLayoutComponent implements OnInit {
    @ViewChild(CmsLayoutComponent, { static: false }) private cmsLayout: CmsLayoutComponent;

    private insertPoints: QueryList<InsertPointDirective>;
    private componentRefs: ComponentRef<any>[] = [];
    private cmsWidgets: CmsComponentConfig[] = [];

    rightTabs: Array<CmsTab> = [];
    leftTabs: Array<CmsTab> = [];

    constructor(private _changeDetectionRef: ChangeDetectorRef, private widgetService: WidgetService) {
        this.cmsWidgets = this.getCmsWidgets();
    }

    protected abstract getCmsWidgets(): Array<CmsComponentConfig>;

    ngOnInit() {
        this.rightTabs = this.getTabsForRightPanel()
        this.leftTabs = this.getTabsForLeftPanel();
    }

    private getTabsForRightPanel(): Array<CmsTab> {
        return this.widgetService.extractCmsTabsFromRegisteredWidgets(this.cmsWidgets, CmsWidgetPosition.Right);
    }

    private getTabsForLeftPanel(): Array<CmsTab> {
        return this.widgetService.extractCmsTabsFromRegisteredWidgets(this.cmsWidgets, CmsWidgetPosition.Left);
    }

    ngAfterViewInit() {
        this.insertPoints = this.cmsLayout.insertPoints;
        this.componentRefs = this.creatingWidgets();
        this._changeDetectionRef.detectChanges();
    }

    private creatingWidgets(): ComponentRef<any>[] {
        const componentRefs = [];
        componentRefs.push(...this.createWidgetsForRightPanel());
        componentRefs.push(...this.createWidgetsForLeftPanel());
        return componentRefs;
    }

    private createWidgetsForRightPanel(): ComponentRef<any>[] {
        const rightRegisteredWidgets = this.cmsWidgets.filter(widget => widget.position == CmsWidgetPosition.Right);
        return this.widgetService.createWidgetComponents(rightRegisteredWidgets, this.insertPoints, this.rightTabs)
    }

    private createWidgetsForLeftPanel(): ComponentRef<any>[] {
        const leftRegisteredWidgets = this.cmsWidgets.filter(widget => widget.position == CmsWidgetPosition.Left);
        return this.widgetService.createWidgetComponents(leftRegisteredWidgets, this.insertPoints, this.leftTabs)
    }

    ngOnDestroy() {
        if (this.componentRefs) {
            this.componentRefs.forEach(cmpRef => {
                cmpRef.destroy();
            })
            this.componentRefs = [];
        }
    }
}
