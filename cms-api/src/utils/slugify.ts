export const slugify = text =>
    text
        .toString()
        .toLowerCase()
        .trim()
        // Replace spaces with -
        .replace(/\s+/g, '-')
        // Replace & with 'and'
        .replace(/&/g, '-and-')
        // Remove all non-word chars
        .replace(/(?!\w)[\x00-\xC0]/g, '-') // eslint-disable-line
        // Replace multiple - with single -
        .trim('-')
        .replace(/\-\-+/g, '-') // eslint-disable-line
        // Remove - from start & end
        .replace(/-$/, '')
        .replace(/^-/, '');