import { Component, ViewEncapsulation } from '@angular/core';
import { PageService, Page } from '@angular-cms/core';
import { HomePage } from '../../pages/home/home.pagetype';
import { tap, switchMap } from 'rxjs/operators';

@Component({
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LayoutComponent {
  startPage: HomePage;
  menuItems: Array<{ name: string, link: string }>;
  constructor(private contentService: PageService) { }

  ngOnInit() {
    this.contentService.getStartPage().pipe(
      switchMap(page => {
        this.startPage = page.properties
        return this.contentService.getPublishedPageChildren(page._id)
      })
    )
      .subscribe((children: Page[]) => {
        this.menuItems = children.map(x => ({ name: x.name, link: x.publishedLinkUrl }))
      })
  }
}
