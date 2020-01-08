import { Injectable, QueryList, ComponentFactoryResolver, Inject } from '@angular/core';

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

    initWidgets(
        registeredWidgets: Array<CmsComponentConfig>,
        insertPoints: QueryList<InsertPointDirective>,
        tabs: Array<CmsTab>,
        position: CmsWidgetPosition): Array<any> {

        let componentRefs: Array<any> = [];
        if (tabs) {
            tabs.forEach((tab: CmsTab) => {
                let viewContainerRef = insertPoints.find(x => x.name == tab.content).viewContainerRef;
                viewContainerRef.clear();
                registeredWidgets.filter(x => x.position == position && (x.group == tab.title || (!x.group && tab.title == this.defaultGroup))).forEach(widget => {
                    componentRefs.push(this.createWidget(viewContainerRef, widget));
                });
            });
        }

        return componentRefs;
    }

    initWidgetTab(registeredWidgets: Array<CmsComponentConfig>, position: CmsWidgetPosition): Array<CmsTab> {
        let tabs = [];
        let widgets = registeredWidgets.filter(widget => widget.position == position);

        widgets.forEach(widget => {
            if (widget.hasOwnProperty('group')) {
                if (tabs.findIndex(x => x.title == widget.group) == -1) {
                    tabs.push({ title: widget.group, content: `${position}_${widget.group}` });
                }
            }
        });

        if (widgets.findIndex(widget => !widget.group) != -1) {
            tabs.push({ title: this.defaultGroup, content: `${position}_${this.defaultGroup}` });
        }

        return tabs.sort(sortTabByTitle);
    }

    private createWidget(viewContainerRef, widget: CmsComponentConfig): any {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(widget.component);
        return viewContainerRef.createComponent(componentFactory);
    }
}