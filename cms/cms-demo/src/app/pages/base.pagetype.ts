import { CmsImage, PageData, Property, UIHint } from '@angular-cms/core';

export abstract class BasePage extends PageData {
    @Property({
        displayName: 'Hero Text',
        displayType: UIHint.Text,
        groupName: 'Hero Banner'
    })
    header: string;

    @Property({
        displayName: 'Hero Image',
        displayType: UIHint.Image,
        groupName: 'Hero Banner'
    })
    heroImage: CmsImage;
}
