import { CmsImage, PageData, Property, UIHint } from '@angular-cms/core';

export abstract class BasePage extends PageData {
    @Property({
        displayName: 'Header',
        displayType: UIHint.Text,
    })
    header: string;

    @Property({
        displayName: 'Hero Image',
        displayType: UIHint.Image,
    })
    heroImage: CmsImage;
}
