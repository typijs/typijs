import { Input, Directive, ViewContainerRef, Inject } from '@angular/core';

@Directive({
  selector: '[cmsInsertPoint]',
})
export class InsertPointDirective {
  @Input('cmsInsertPoint') name: string;

  constructor(@Inject(ViewContainerRef) public viewContainerRef: ViewContainerRef) { }
}
