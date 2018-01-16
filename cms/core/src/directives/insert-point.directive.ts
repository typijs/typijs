import { Directive, ViewContainerRef, Inject } from '@angular/core';

@Directive({
  selector: '[cmsInsertPoint]',
})
export class InsertPointDirective {
  constructor(@Inject(ViewContainerRef) public viewContainerRef: ViewContainerRef) { }
}