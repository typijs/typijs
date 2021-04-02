import { ComponentRef, Directive, EventEmitter, Input, OnDestroy, OnInit, Output, ViewContainerRef } from '@angular/core';
import { ContentReference } from '../../types/content-reference';
import { ContentTypeEnum } from '../../constants/content-type.enum';
import { CmsContentRenderFactoryResolver } from '../content-render.factory';
import { ContentLoader } from '../../services/content/content-loader.service';
import { Content } from '../../services/content/models/content.model';
import { VersionStatus } from '../../constants/version-status';

@Directive({
    selector: '[contentArea]'
})
export class ContentAreaDirective implements OnInit, OnDestroy {

    @Output() contentLoaded = new EventEmitter();
    @Input('contentArea') contentAreaItems: Array<ContentReference & Partial<Content>>;
    private componentRefs: ComponentRef<any>[] = [];

    constructor(
        private viewContainerRef: ViewContainerRef,
        private contentLoader: ContentLoader,
        private cmsContentRenderFactoryResolver: CmsContentRenderFactoryResolver) { }

    ngOnInit(): void {
        if (this.contentAreaItems && this.contentAreaItems.length > 0) {

            const firstItem = this.contentAreaItems[0];
            const mustFetchItems: boolean = !firstItem.status;
            if (mustFetchItems) {
                this.contentLoader.getItems(this.contentAreaItems, null, [VersionStatus.Published], true).subscribe((contents: Content[]) => {

                    this.contentAreaItems.forEach(item => {
                        const matchContent = contents.find(x => item._id === x._id);
                        if (matchContent) {
                            item = Object.assign(item, matchContent);
                        }
                    });

                    this.renderContentAreaComponent();
                });
            } else {
                this.renderContentAreaComponent();
            }
        }
    }

    ngOnDestroy() {
        if (this.componentRefs) {
            this.componentRefs.forEach(component => component.destroy());
            this.componentRefs = [];
        }
    }

    private renderContentAreaComponent() {
        this.viewContainerRef.clear();
        this.contentAreaItems.forEach(content => {
            const createdComponent = this.createContentComponent(content);
            if (createdComponent) {
                this.componentRefs.push(createdComponent);

            }
        });
        setTimeout(() => { this.contentLoaded.emit(); }, 0);
    }

    private createContentComponent(content: any): ComponentRef<any> {
        try {
            // Incase the page is dragged to content area, the page partial will be used to render
            if (content.type === ContentTypeEnum.Page) {
                const contentRenderFactory = this.cmsContentRenderFactoryResolver.resolveContentRenderFactory(ContentTypeEnum.PagePartial);
                return contentRenderFactory.createContentComponent(content, this.viewContainerRef);
            } else {
                const contentRenderFactory = this.cmsContentRenderFactoryResolver.resolveContentRenderFactory(content.type);
                return contentRenderFactory.createContentComponent(content, this.viewContainerRef);
            }
        } catch (err) {
            console.error(err);
        }
    }
}
