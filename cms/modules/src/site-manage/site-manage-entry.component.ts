import { Component } from '@angular/core';

@Component({
  template: `
  <span class="badge badge-info" [routerLink]="['site-manage']">Manage Websites</span>
  `
})
export class SiteManageEntryComponent {

  constructor() { }
}
