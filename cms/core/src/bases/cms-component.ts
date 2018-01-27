import { Input } from '@angular/core';
import { ContentData } from './content-data';

export class CmsComponent<T extends ContentData> {
    @Input() currentContent: T;
}