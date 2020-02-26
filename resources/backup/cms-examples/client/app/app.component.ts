import { Component } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

@Component({
  selector: 'body',
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {
  constructor(router: Router) {
    console.log(router);
  }
}
