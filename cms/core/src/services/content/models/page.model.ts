import { Content, ContentVersion } from './content.model';

export interface Page extends Content {
    // IPage
    visibleInMenu: boolean;
    // IPageLanguage
    urlSegment: string;
    simpleAddress: string;

    linkUrl: string;
}

export interface PageVersion extends ContentVersion {
    // IPage
    visibleInMenu: boolean;
    // IPageLanguage
    urlSegment: string;
    simpleAddress: string;
}
