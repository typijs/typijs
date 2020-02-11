import { Component, ViewEncapsulation } from '@angular/core';
import { PageService } from '@angular-cms/core';
import { HomePage } from '../../pages/home/home.pagetype';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LayoutComponent {
  startPage$: Observable<HomePage>;
  menuItems$: Observable<Array<{ name: string, link: string }>>;

  constructor(private contentService: PageService) { }

  ngOnInit() {
    this.startPage$ = this.contentService.getStartPage().pipe(
      tap(page => {
        this.menuItems$ = this.contentService.getPublishedPageChildren(page._id).pipe(
          map(children => children.map(child => ({ name: child.name, link: child.publishedLinkUrl })))
        );
      }),
      map(page => page.properties)
    );
  }
}
