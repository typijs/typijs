import { Component } from '@angular/core';
import PAGES from './core/core';
import { PAGE_TYPE_ANNOTATIONS } from './core/page-type.metadata'
import { PROPERTY_ANNOTATIONS, PROPERTIES } from './core/property.metadata'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'app';
  pages: Array<any> = [];

  ngOnInit() {
    PAGES.forEach(pageType => {
      let metadata = Reflect.getMetadata(PAGE_TYPE_ANNOTATIONS, pageType);
      for (var key in pageType) {
        console.log(key);
      }
      let properties = Reflect.getMetadata(PROPERTIES, pageType);
      let propertiesMetadata = [];
      if (properties)
        properties.forEach(element => {
          propertiesMetadata.push(Reflect.getMetadata(PROPERTY_ANNOTATIONS, pageType, element))
        });
      this.pages.push({
        type: pageType,
        metadata: metadata,
        properties: propertiesMetadata
      })
    })
  }
}
