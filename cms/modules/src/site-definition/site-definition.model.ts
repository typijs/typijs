import { BaseService, ContentReference, ContentTypeEnum, ISelectionFactory, Property, SelectItem, UIHint } from '@typijs/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Column } from '../shared/table/column.decorator';

export type Language = {
    language: string;
    name: string;
};

@Injectable()
export class LanguageSelectionFactory extends BaseService implements ISelectionFactory {
    protected apiUrl: string = `${this.baseApiUrl}/language`;
    constructor(httpClient: HttpClient) {
        super(httpClient);
    }

    getSelectItems(): Observable<SelectItem[]> {
        return this.httpClient.get<Language[]>(`${this.apiUrl}/getAvailableLanguages`).pipe(
            map((languages: Language[]) => languages.map(lang => <SelectItem>{ value: lang.language, text: `${lang.name} (${lang.language})` }))
        );
    }
}

export class HostDefinition {
    @Property({
        displayName: 'Hostname',
        displayType: UIHint.Text
    })
    name: string;

    @Property({
        displayName: 'Language',
        displayType: UIHint.Dropdown,
        selectionFactory: LanguageSelectionFactory
    })
    language: string;

    @Property({
        displayName: 'Is Primary',
        displayType: UIHint.Checkbox
    })
    isPrimary: boolean;

    @Property({
        displayName: 'Is Https',
        displayType: UIHint.Checkbox
    })
    isHttps: boolean;
}

export class SiteDefinition {
    _id: string;

    @Column({
        header: 'Site Name'
    })
    @Property({
        displayName: 'Site name'
    })
    name: string;

    @Column({
        header: 'Site Url'
    })
    siteUrl: string;

    @Column({
        header: 'Start Page'
    })
    startPageName: string;

    @Property({
        displayName: 'Start page',
        displayType: UIHint.ContentReference
    })
    startPage: any;

    @Property({
        displayName: 'Hosts',
        displayType: UIHint.ObjectList,
        objectListItemType: HostDefinition
    })
    hosts: HostDefinition[];

    constructor(siteDefinition: Partial<SiteDefinition>) {
        const startPageName = this.getStartPageName(siteDefinition);
        const siteUrl = this.getSiteUrl(siteDefinition);
        const startPage = this.getStartPageReference(siteDefinition, startPageName);
        const siteDefinitionDto: Partial<SiteDefinition> = {
            ...siteDefinition,
            siteUrl,
            startPageName,
            startPage
        };

        Object.assign(this, siteDefinitionDto);
    }

    private getSiteUrl(siteDefinition: Partial<SiteDefinition>): string {
        const primaryHost = this.getHostname(siteDefinition);
        const https = primaryHost?.isHttps ? 'https' : 'http';
        return `${https}://${primaryHost?.name}`;
    }

    private getStartPageName(siteDefinition: Partial<SiteDefinition>): string {
        const primaryHost = this.getHostname(siteDefinition);
        const language = primaryHost?.language;
        const startPage = siteDefinition?.startPage?.contentLanguages?.find(x => x.language == language);
        return startPage?.name;
    }

    private getHostname(siteDefinition: Partial<SiteDefinition>) {
        const hosts = siteDefinition.hosts;
        if (!hosts || hosts.length === 0) { return null; }

        const primaryHost = siteDefinition.hosts.find(x => x.isPrimary);
        if (primaryHost) { return primaryHost; }

        return siteDefinition.hosts[0];
    }

    private getStartPageReference(siteDefinition: Partial<SiteDefinition>, pageName: string): ContentReference {
        if (!siteDefinition.startPage) { return null; }

        return {
            id: siteDefinition.startPage._id,
            type: ContentTypeEnum.Page,
            name: pageName,
            contentType: siteDefinition.startPage.contentType
        };
    }
}


