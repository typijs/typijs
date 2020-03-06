export type ContentTreeNode = {
    type: 'page' | 'block' | 'media' | 'folder_block' | 'folder_media'
    contentType?: string
    isPublished?: boolean
}