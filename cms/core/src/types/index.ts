/**
 * Function.prototype
 */
export type ClassOf<T> = new (...args: any[]) => T;
/**
 * Object.prototype
 */
export type CmsObject = { [key: string]: any };

export type CmsTab = {
    name: string,
    title: string
}

export type CmsImage = {
    src: string,
    alt: string
}

export type CmsLink = {
    url: string,
    text: string
    target: '_blank ' | '_self' | '_parent' | '_top'
}

export type ContentReference = {
    id: string
    type: 'page' | 'block' | 'media' | 'folder_block' | 'folder_media'
    contentType: string
    [propName: string]: any
}