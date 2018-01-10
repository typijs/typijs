import { Component, ViewEncapsulation } from '@angular/core';
import { Http, Response, URLSearchParams, RequestOptions, Headers } from '@angular/http';
import { ContentService } from '@angular-cms/core';

@Component({
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LayoutComponent {
  startPage: any;
  constructor(private contentService: ContentService) {}

  ngOnInit() {
    this.contentService.getStartPage().subscribe(res=>{
      console.log(res);
      this.startPage = res.properties;
    })
  }
}
