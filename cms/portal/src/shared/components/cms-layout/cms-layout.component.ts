import { Input, ViewEncapsulation, ViewChildren, Component, QueryList, Inject } from '@angular/core';

import { CmsTab, InsertPointDirective, BrowserStorageService } from '@angular-cms/core';

type PanelConfig = {
    visible: boolean,
    size: number | string
}

type LayoutConfig = {
    panels: PanelConfig[]
}

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
    templateUrl: './cms-layout.component.html',
    styleUrls: ['./cms-layout.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CmsLayoutComponent {
    @ViewChildren(InsertPointDirective) insertPoints: QueryList<InsertPointDirective>;

    @Input() rightTabs: Array<CmsTab> = [];
    @Input() leftTabs: Array<CmsTab> = [];

    layoutConfig: LayoutConfig;
    private readonly layoutConfigKey: string = 'cms-layout-config-key';

    constructor(private storageService: BrowserStorageService) { }

    ngOnInit() {
        if (this.storageService.get(this.layoutConfigKey)) {
            this.layoutConfig = JSON.parse(this.storageService.get(this.layoutConfigKey))
        } else {
            this.resetConfig();
        }
    }

    private resetConfig() {
        this.layoutConfig = Object.assign({}, { panels: defaultPanelConfigs });

        this.storageService.remove(this.layoutConfigKey);
    }

    private saveLocalStorage() {
        this.storageService.set(this.layoutConfigKey, JSON.stringify(this.layoutConfig));
    }

    toggleLeftPanel() {
        this.layoutConfig.panels[0].visible = !this.layoutConfig.panels[0].visible;
        this.saveLocalStorage();
    }

    toggleRightPanel() {
        this.layoutConfig.panels[2].visible = !this.layoutConfig.panels[2].visible;
        this.saveLocalStorage();
    }

    onDragEnd(eventData: { gutterNum: number, sizes: Array<number> }) {
        // Set size for all visible columns
        this.layoutConfig.panels.filter(x => x.visible == true).forEach((row, index) => row.size = eventData.sizes[index])

        this.saveLocalStorage();
    }

}
