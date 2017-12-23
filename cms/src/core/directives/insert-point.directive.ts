import { Directive, ViewContainerRef, Inject } from '@angular/core';

@Directive({
  selector: '[insert-point]',
})
export class InsertPointDirective {
  constructor(@Inject(ViewContainerRef) public viewContainerRef: ViewContainerRef) { }
}