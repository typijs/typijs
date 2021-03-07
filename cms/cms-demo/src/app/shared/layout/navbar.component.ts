import { Component, Input } from '@angular/core';
import { HomePage } from '../../pages/home/home.pagetype';
import { MenuItem } from '../menu.service';

@Component({
    selector: 'nav-bar',
    template: `
<nav class="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
    <div class="container">
      <a class="navbar-brand" [routerLink]="['']" [cmsText]="startPage.textLogo"></a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav"
        aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="oi oi-menu"></span> Menu
      </button>
      <div class="collapse navbar-collapse" id="ftco-nav">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item active"><a [routerLink]="['']" class="nav-link">Home</a></li>
          <ng-container *ngFor="let item of menuItems">
            <li *ngIf="item.children && item.children.length > 0" dropdown triggers="hover" class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" dropdownToggle [id]="item.id" [cmsUrl]="item.contentLink | toUrl">
                {{item.name}}
              </a>
              <div class="dropdown-menu" *dropdownMenu [attr.aria-labelledby]="item.id">
                <a *ngFor="let subitem of item.children" class="dropdown-item"
                  [cmsUrl]="subitem.contentLink | toUrl">{{subitem.name}}</a>
              </div>
            </li>
            <li *ngIf="!item.children || item.children == 0" class="nav-item">
              <a class="nav-link" [cmsUrl]="item.contentLink | toUrl">
                {{item.name}}
              </a>
            </li>
          </ng-container>
          <li class="nav-item cta cta-colored">
            <a [cmsUrl]="startPage.shoppingCartPage | toUrl" class="nav-link">
              <span class="icon-shopping_cart"></span>[0]
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
    `
})
export class NavbarComponent {
    @Input() menuItems: MenuItem[];
    @Input() startPage: HomePage;
}
