import { Property, UIHint, SelectItem, ISelectionFactory } from '@angular-cms/core';
import { Observable, of } from 'rxjs';

export class LinkTypeSelectionFactory implements ISelectionFactory {
    getSelectItems(): Observable<SelectItem[]> {
        return of([
            { value: 'page', text: 'Page' },
            { value: 'media', text: 'Media' },
            { value: 'email', text: 'E-mail' },
            { value: 'external', text: 'External link' }
        ])
    }
}

export class LinkTargetSelectionFactory implements ISelectionFactory {
    getSelectItems(): Observable<SelectItem[]> {
        return of([
            { value: '_blank', text: 'Open the url in a new window' },
            { value: '_self', text: 'Open the url in the whole window' }
        ])
    }
}

export class UrlItem {
    @Property({
        displayName: 'Link name/text',
        displayType: UIHint.Text
    })
    text: string;

    @Property({
        displayName: 'Link title',
        displayType: UIHint.Text
    })
    title: string;

    @Property({
        displayName: 'Open in',
        displayType: UIHint.Dropdown,
        selectionFactory: LinkTargetSelectionFactory
    })
    target: string;

    @Property({
        displayName: 'Link type',
        displayType: UIHint.Dropdown,
        selectionFactory: LinkTypeSelectionFactory
    })
    urlType: string;

    @Property()
    page: any;

    @Property()
    media: any;

    @Property()
    email: any;

    @Property()
    external: any;

    @Property()
    remainingUrl: any;
}
