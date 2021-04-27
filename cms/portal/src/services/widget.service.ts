import { Injectable, QueryList, ComponentFactoryResolver, Inject, ViewContainerRef, ComponentRef } from '@angular/core';

import {
    InsertPointDirective,
    CmsComponentConfig,
    CmsWidgetPosition,
    CmsTab,
    sortByString
} from '@typijs/core';

@Injectable()
export class WidgetService {
    private readonly GLOBAL_GROUP = 'Global';

    constructor(@Inject(ComponentFactoryResolver) private componentFactoryResolver: ComponentFactoryResolver) { }

    createWidgetComponents(
        registeredWidgets: CmsComponentConfig[],
        insertPoints: QueryList<InsertPointDirective>,
        tabs: CmsTab[]): ComponentRef<any>[] {

        const componentRefs: any[] = [];
        if (tabs) {
            tabs.forEach((tab: CmsTab) => {
                // get View Container Ref for each tab
                const viewContainerRefs = insertPoints.filter(x => x.name == tab.name).map(x => x.viewContainerRef);
                if (!viewContainerRefs || viewContainerRefs.length == 0) { return; }

                viewContainerRefs.forEach(x => x.clear());
                // get registered widgets for each tab
                const registeredWidgetsInTab = registeredWidgets
                    .filter(x => x.group == tab.title || (!x.group && tab.title == this.GLOBAL_GROUP));

                const nonSplitWidgets = registeredWidgetsInTab.filter(x => !x.isSplit);
                // all not split widget will be put to the first area in tab
                for (let index = 0; index < nonSplitWidgets.length; index++) {
                    const widget = nonSplitWidgets[index];
                    componentRefs.push(this.createWidget(viewContainerRefs[0], widget));
                }
                const splitWidgets = registeredWidgetsInTab.filter(x => x.isSplit);
                // the remaining widget will be put to the remaining areas
                for (let index = 0; index < splitWidgets.length; index++) {
                    const widget = splitWidgets[index];
                    // in case there is not any non split widget, the index area will start from 0
                    const areaIndex = nonSplitWidgets.length > 0 ? index + 1 : index;
                    if (areaIndex < viewContainerRefs.length) {
                        componentRefs.push(this.createWidget(viewContainerRefs[areaIndex], widget));
                    }
                }
            });
        }

        return componentRefs;
    }

    extractCmsTabsFromRegisteredWidgets(registeredWidgets: CmsComponentConfig[], position: CmsWidgetPosition): CmsTab[] {
        const tabs: CmsTab[] = [];
        const widgets = registeredWidgets.filter(widget => widget.position == position);

        widgets.forEach(widget => {
            if (widget.hasOwnProperty('group')) {
                if (tabs.findIndex(x => x.title == widget.group) == -1) {
                    tabs.push({ title: widget.group, name: `${position}_${widget.group}`, areas: 0 });
                }
            }
        });

        if (widgets.findIndex(widget => !widget.group) != -1) {
            tabs.push({ title: this.GLOBAL_GROUP, name: `${position}_${this.GLOBAL_GROUP}`, areas: 0 });
        }

        tabs.forEach(tab => tab.areas = this.getNumberAreasOfTab(widgets, tab));

        return tabs.sort(sortByString('title', 'asc'));
    }

    private getNumberAreasOfTab(registeredWidgets: CmsComponentConfig[], tab: CmsTab): number {
        const widgetsInTab = registeredWidgets.filter(x => x.group == tab.title);
        const nonSplit = widgetsInTab.filter(x => !x.isSplit).length;
        return widgetsInTab.filter(x => x.isSplit).length + (nonSplit > 0 ? 1 : 0);
    }

    private createWidget(viewContainerRef: ViewContainerRef, widget: CmsComponentConfig): ComponentRef<any> {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(widget.component);
        return viewContainerRef.createComponent(componentFactory);
    }
}
