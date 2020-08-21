import { Injectable, QueryList, ComponentFactoryResolver, Inject, ViewContainerRef, ComponentRef } from '@angular/core';

import {
    InsertPointDirective,
    CmsComponentConfig,
    CmsWidgetPosition,
    CmsTab,
    sortTabByTitle
} from '@angular-cms/core';

@Injectable()
export class WidgetService {
    private defaultGroup: string = 'Global';

    constructor(@Inject(ComponentFactoryResolver) private componentFactoryResolver: ComponentFactoryResolver) { }

    createWidgetComponents(
        registeredWidgets: Array<CmsComponentConfig>,
        insertPoints: QueryList<InsertPointDirective>,
        tabs: Array<CmsTab>): ComponentRef<any>[] {

        const componentRefs: Array<any> = [];
        if (tabs) {
            tabs.forEach((tab: CmsTab) => {
                //get View Container Ref for each tab
                const viewContainerRef = insertPoints.find(x => x.name == tab.name).viewContainerRef;
                if (!viewContainerRef) return;

                viewContainerRef.clear();
                //get registered widgets for each tab
                const registeredWidgetsInTab = registeredWidgets.filter(x => x.group == tab.title || (!x.group && tab.title == this.defaultGroup));
                registeredWidgetsInTab.forEach(widget => {
                    componentRefs.push(this.createWidget(viewContainerRef, widget));
                });
            });
        }

        return componentRefs;
    }

    extractCmsTabsFromRegisteredWidgets(registeredWidgets: Array<CmsComponentConfig>, position: CmsWidgetPosition): Array<CmsTab> {
        const tabs: CmsTab[] = [];
        const widgets = registeredWidgets.filter(widget => widget.position == position);

        widgets.forEach(widget => {
            if (widget.hasOwnProperty('group')) {
                if (tabs.findIndex(x => x.title == widget.group) == -1) {
                    tabs.push({ title: widget.group, name: `${position}_${widget.group}` });
                }
            }
        });

        if (widgets.findIndex(widget => !widget.group) != -1) {
            tabs.push({ title: this.defaultGroup, name: `${position}_${this.defaultGroup}` });
        }

        return tabs.sort(sortTabByTitle);
    }

    private createWidget(viewContainerRef: ViewContainerRef, widget: CmsComponentConfig): ComponentRef<any> {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(widget.component);
        return viewContainerRef.createComponent(componentFactory);
    }
}
