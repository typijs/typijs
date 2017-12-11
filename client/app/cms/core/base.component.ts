import { Input } from '@angular/core';
import { PageBase } from './base.pagetype';

export class ComponentBase<T extends PageBase> {
    @Input() currentContent: T;
}