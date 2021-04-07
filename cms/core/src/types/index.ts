/**
 * Class type declaration
 *
 * T can be a interface which the class must implemented
 *
 * T can be a class which the class must extend or has the same signature (equal)
 *
 * T can be `any` to indicate the class don't need implement any interface or extend any base class
 */
export type ClassOf<T> = new (...args: any[]) => T;

/**
 * Object.prototype
 */
export type CmsObject = { [key: string]: any };

/**
 * Function declaration
 */
export type CmsFunction = (...args: any[]) => any;

export type CmsTab = {
    /**
     * The tab name
     */
    name: string,
    /**
     * The title of each tab
     */
    title: string,
    /**
     * The number of area in each tab
     */
    areas: number
};

/**
 * The type of content such as `page`, `block`, `media`, `folder_block`, `folder_media`
 */
export type TypeOfContent = 'page' | 'block' | 'media' | 'folder_block' | 'folder_media' | string;


