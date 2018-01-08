import { Input } from '@angular/core';
import { SelectItem } from "./select-item";
import { BaseElement } from './../base.element';

export class SelectElement extends BaseElement{
    @Input() selectItems: SelectItem[];
}