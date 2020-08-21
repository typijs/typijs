import { Input, ViewChildren, Component, QueryList, OnInit } from '@angular/core';

import { CmsTab, InsertPointDirective, BrowserStorageService } from '@angular-cms/core';
import { SubjectService } from '@angular-cms/modules';

type PanelConfig = {
    visible: boolean,
    size: number | string
};

type LayoutConfig = {
    headerSize: number
    panels: PanelConfig[]
};

const defaultPanelConfigs: PanelConfig[] = [
    {
        visible: true,
        size: 300
    },
    {
        visible: true,
        size: '*'
    },
    {
        visible: true,
        size: 300
    }
]

@Component({
    selector: 'cms-layout',
    templateUrl: './cms-layout.component.html'
})
export class CmsLayoutComponent {
    @ViewChildren(InsertPointDirective) insertPoints: QueryList<InsertPointDirective>;

    @Input() rightTabs: Array<CmsTab> = [];
    @Input() leftTabs: Array<CmsTab> = [];

    layoutConfig: LayoutConfig;
    private readonly layoutConfigKey: string = 'cms-layout-config-key';
    private readonly headerSizeDefault: number = 55;

    constructor(
        private storageService: BrowserStorageService,
        private subjectService: SubjectService) { }

    ngOnInit() {
        if (this.storageService.get(this.layoutConfigKey)) {
            this.layoutConfig = JSON.parse(this.storageService.get(this.layoutConfigKey))
        } else {
            this.resetConfig();
        }
    }

    private resetConfig() {
        this.layoutConfig = Object.assign({}, { headerSize: this.headerSizeDefault, panels: defaultPanelConfigs });

        this.storageService.remove(this.layoutConfigKey);
    }

    toggleLeftPanel() {
        this.layoutConfig.panels[0].visible = !this.layoutConfig.panels[0].visible;
        this.saveLocalStorage();
    }

    toggleRightPanel() {
        this.layoutConfig.panels[2].visible = !this.layoutConfig.panels[2].visible;
        this.saveLocalStorage();
    }

    toggleHeader() {
        this.layoutConfig.headerSize = this.headerSizeDefault - this.layoutConfig.headerSize;
        this.saveLocalStorage();
    }

    onDragEnd(eventData: { gutterNum: number, sizes: Array<number> }) {
        this.subjectService.portalLayoutChanged$.next(false);
        // Set size for all visible columns
        this.layoutConfig.panels.filter(x => x.visible == true).forEach((row, index) => row.size = eventData.sizes[index])
        this.saveLocalStorage();
    }

    onDragStart() {
        this.subjectService.portalLayoutChanged$.next(true);
    }

    private saveLocalStorage() {
        this.storageService.set(this.layoutConfigKey, JSON.stringify(this.layoutConfig));
    }
}
