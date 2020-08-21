import { PageData, PageService } from '@angular-cms/core';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { HomePage } from '../../pages/home/home.pagetype';

@Component({
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LayoutComponent implements OnInit {
  startPage$: Observable<HomePage>;
  menuItems$: Observable<PageData[]>;

  constructor(private contentService: PageService) { }

  ngOnInit() {
    this.startPage$ = this.contentService.getStartPage().pipe(
      tap(page => {
        if (page) {
          this.menuItems$ = this.contentService.getPublishedPageChildren(page._id).pipe(
            map(children => children.map(childPage => new PageData(childPage)))
          );
        }
      }),
      map(page => new HomePage(page))
    );
  }
}
