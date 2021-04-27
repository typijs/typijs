import { Property, ValidationTypes, UIHint } from '@typijs/core';

export class LinkItem {
    @Property({
        displayName: 'Link Icon',
        displayType: UIHint.Text
    })
    linkIcon: string;

    @Property({
        displayName: 'Link Text',
        displayType: UIHint.Text,
        validates: [
            ValidationTypes.required('Link text is required')]
    })
    linkText: string;

    @Property({
        displayName: 'Link Url',
        displayType: UIHint.Text
    })
    linkUrl: string;
}
