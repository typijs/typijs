import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Page } from '../models/page.model';

export class SubjectService {

  pageCreated$: Subject<Page> = new Subject<Page>();
  pageSelected$: Subject<Page> = new Subject<Page>();

  firePageCreated(pageData) {
    this.pageCreated$.next(pageData);
  }

  firePageSelected(pageData) {
    this.pageSelected$.next(pageData);
  }
}
