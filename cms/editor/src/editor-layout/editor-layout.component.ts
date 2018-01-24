import { Component, Input, OnInit, ViewEncapsulation, ChangeDetectorRef, ViewChildren, QueryList, ComponentFactoryResolver, Injector, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

import { CMS, UIHint, CmsProperty, InsertPointDirective, ContentService, Content, ISelectionFactory, CmsComponentConfig } from '@angular-cms/core';

@Component({
    templateUrl: './editor-layout.component.html',
    styleUrls: ['./editor-layout.component.scss']
})
export class EditorLayoutComponent {
    @ViewChildren(InsertPointDirective) insertPoints: QueryList<InsertPointDirective>;

    constructor(
        @Inject(ComponentFactoryResolver) private componentFactoryResolver: ComponentFactoryResolver,
        private _changeDetectionRef : ChangeDetectorRef,
        private injector: Injector,
        private contentService: ContentService,
        private route: ActivatedRoute) { }

    ngAfterViewInit() {
        //setTimeout(_ => this.initCreatingWidget()) // BUGFIX: https://github.com/angular/angular/issues/6005#issuecomment-165911194
        this.initCreatingWidget();
        this._changeDetectionRef.detectChanges();
    }

    initCreatingWidget() {
        let leftViewContainerRef = this.insertPoints.find(x => x.name == "1").viewContainerRef;
        leftViewContainerRef.clear();

        CMS.EDITOR_WIDGETS().filter(x => x.position == 1).forEach(widget => {
            this.createWidget(leftViewContainerRef, widget);
        })


        let rightViewContainerRef = this.insertPoints.find(x => x.name == "2").viewContainerRef;
        rightViewContainerRef.clear();

        CMS.EDITOR_WIDGETS().filter(x => x.position == 2).forEach(widget => {
            this.createWidget(rightViewContainerRef, widget);
        })
    }

    createWidget(viewContainerRef, widget: CmsComponentConfig) {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(widget.component);
        viewContainerRef.createComponent(componentFactory);
    }
}
