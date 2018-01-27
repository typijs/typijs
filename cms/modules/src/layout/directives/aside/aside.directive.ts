import { Directive, HostListener } from '@angular/core';
import { LAYOUT_CLASS } from './../../../constants';

/**
* Allows the aside to be toggled via click.
*/
@Directive({
  selector: '[appAsideMenuToggler]',
})
export class AsideToggleDirective {
  constructor() { }

  @HostListener('click', ['$event'])
  toggleOpen($event: any) {
    $event.preventDefault();
    document.querySelector(LAYOUT_CLASS).classList.toggle('aside-menu-hidden');
  }
}
