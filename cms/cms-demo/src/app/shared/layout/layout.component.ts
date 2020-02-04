import { Component, ViewEncapsulation } from '@angular/core';
import { PageService } from '@angular-cms/core';

@Component({
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LayoutComponent {
  startPage: any;
  constructor(private contentService: PageService) { }

  ngOnInit() {
    this.contentService.getStartPage().subscribe(res => {
      this.startPage = res.properties;
    })
  }
}
