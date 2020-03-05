export const PAGE_TYPE = "page";
export const BLOCK_TYPE = "block";
export const MEDIA_TYPE = "media";
export const FOLDER_BLOCK = 'folder_block';
export const FOLDER_MEDIA = 'folder_media';

export type ContentTreeNode = {
    type: 'page' | 'block' | 'media' | 'folder_block' | 'folder_media'
    contentType?: string
    isPublished?: boolean
}