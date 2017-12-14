import { Input } from '@angular/core';
import { ContentData } from './content-data';

export class BaseComponent<T extends ContentData> {
    @Input() currentContent: T;
}