import { ContentData, ContentLoader, ContentReference, PageData } from '@typijs/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class MenuItem {
    id: string;
    name: string;
    contentLink: ContentReference;
    children: MenuItem[];
    constructor(contentData: Partial<ContentData>) {
        this.id = contentData?.contentLink?.id;
        this.name = contentData?.name;
        this.contentLink = contentData?.contentLink;
    }
}

@Injectable({ providedIn: 'root' })
export class MenuService {
    constructor(private contentLoader: ContentLoader) { }

    getPageVisibleInMenu(startPage: PageData): Observable<MenuItem[]> {
        return this.contentLoader.query<PageData>({
            type: startPage.contentLink.type,
            parentPath: { $regex: `,${startPage.contentLink.id},` },
            language: startPage.language,
            visibleInMenu: true
        }, '_id,parentId,parentPath, language, urlSegment, name', 'peerOrder').pipe(
            map(queryResult => this.buildMenu(startPage.contentLink.id, queryResult.docs))
        );
    }

    private buildMenu(parentId: string, pages: PageData[]): MenuItem[] {
        const menuItems = pages.filter(page => page.parentId === parentId).map(page => new MenuItem(page));
        menuItems.forEach(item => item.children = this.buildMenu(item.contentLink.id, pages));
        return menuItems;
    }
}
