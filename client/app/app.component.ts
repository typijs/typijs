import { Component } from '@angular/core';
import PAGES from './core/core';
import { PAGE_TYPES, PAGE_TYPE_ANNOTATIONS } from './core/page-type.metadata'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'app';
  pages: Array<any> = [];

  ngOnInit() {
    PAGES.forEach(page => {
      let metadata = Reflect.getMetadata(PAGE_TYPE_ANNOTATIONS, page);
      this.pages.push({
        type: page,
        metadata: metadata
      })
    })
  }
}
