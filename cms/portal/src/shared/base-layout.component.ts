import { ChangeDetectorRef, OnInit, QueryList, ViewChild, ComponentRef, AfterViewInit, OnDestroy, Directive } from '@angular/core';

import { CmsComponentConfig, CmsTab, CmsWidgetPosition, InsertPointDirective, sortByNumber } from '@typijs/core';

import { WidgetService } from '../services/widget.service';
import { CmsLayoutComponent } from './components/cms-layout/cms-layout.component';

@Directive()
export abstract class BaseLayoutComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(CmsLayoutComponent) private cmsLayout: CmsLayoutComponent;

    private insertPoints: QueryList<InsertPointDirective>;
    private componentRefs: ComponentRef<any>[];
    protected cmsWidgets: CmsComponentConfig[];

    rightTabs: CmsTab[] = [];
    leftTabs: CmsTab[] = [];

    constructor(private _changeDetectionRef: ChangeDetectorRef, private widgetService: WidgetService, widgets: CmsComponentConfig[]) {
        this.componentRefs = [];
        this.cmsWidgets = widgets.sort(sortByNumber('order', 'asc'));;
    }

    ngOnInit() {
        this.rightTabs = this.getTabsForRightPanel();
        this.leftTabs = this.getTabsForLeftPanel();
    }

    ngAfterViewInit() {
        this.insertPoints = this.cmsLayout.insertPoints;
        this.componentRefs = this.creatingWidgets();
        this._changeDetectionRef.detectChanges();
    }

    ngOnDestroy() {
        if (this.componentRefs) {
            this.componentRefs.forEach(cmpRef => {
                cmpRef.destroy();
            });
            this.componentRefs = [];
        }
    }

    private getTabsForRightPanel(): CmsTab[] {
        return this.widgetService.extractCmsTabsFromRegisteredWidgets(this.cmsWidgets, CmsWidgetPosition.Right);
    }

    private getTabsForLeftPanel(): CmsTab[] {
        return this.widgetService.extractCmsTabsFromRegisteredWidgets(this.cmsWidgets, CmsWidgetPosition.Left);
    }

    private creatingWidgets(): ComponentRef<any>[] {
        const componentRefs = [];
        componentRefs.push(...this.createWidgetsForRightPanel());
        componentRefs.push(...this.createWidgetsForLeftPanel());
        return componentRefs;
    }

    private createWidgetsForRightPanel(): ComponentRef<any>[] {
        const rightRegisteredWidgets = this.cmsWidgets.filter(widget => widget.position == CmsWidgetPosition.Right);
        return this.widgetService.createWidgetComponents(rightRegisteredWidgets, this.insertPoints, this.rightTabs);
    }

    private createWidgetsForLeftPanel(): ComponentRef<any>[] {
        const leftRegisteredWidgets = this.cmsWidgets.filter(widget => widget.position == CmsWidgetPosition.Left);
        return this.widgetService.createWidgetComponents(leftRegisteredWidgets, this.insertPoints, this.leftTabs);
    }
}
