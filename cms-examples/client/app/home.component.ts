import { Component } from '@angular/core';
import { Http, Response, URLSearchParams, RequestOptions, Headers } from '@angular/http';
import { TestInjectService } from './pages/blog/test.service';

@Component({
  template: `<h2>This is home component
    <cms-template></cms-template>
  </h2>`,
})
export class HomeComponent {
    constructor(protected http: Http, private testService: TestInjectService) {
        
            }
}
