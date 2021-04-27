import { Observable, of } from 'rxjs';
import { ISelectionFactory, SelectItem } from '../bases/selection-factory';
import { Property } from '../decorators/property.decorator';
import { ContentReference } from './content-reference';
import { ImageReference } from './image-reference';
import { UIHint } from './ui-hint';

export type LinkType = 'page' | 'media' | 'email' | 'external';
export type LinkTarget = '_blank ' | '_self' | '_parent' | '_top';

export class LinkTypeSelectionFactory implements ISelectionFactory {
    getSelectItems(): Observable<SelectItem[]> {
        return of([
            { value: 'page', text: 'Page' },
            { value: 'media', text: 'Media' },
            { value: 'email', text: 'E-mail' },
            { value: 'external', text: 'External link' }
        ]);
    }
}

export class LinkTargetSelectionFactory implements ISelectionFactory {
    getSelectItems(): Observable<SelectItem[]> {
        return of([
            { value: '_blank', text: 'Open the url in a new window' },
            { value: '_self', text: 'Open the url in the whole window' }
        ]);
    }
}

export class CmsUrl {
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
    target: LinkTarget;

    @Property({
        displayName: 'Link type',
        displayType: UIHint.Dropdown,
        selectionFactory: LinkTypeSelectionFactory
    })
    urlType: LinkType;

    @Property()
    page: ContentReference;

    @Property()
    media: ImageReference;

    @Property()
    email: any;

    @Property()
    external: any;

    @Property()
    remainingUrl: any;
}
