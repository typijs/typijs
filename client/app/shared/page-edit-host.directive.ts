import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[page-edit-host]',
})
export class PageEditDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}