import { Router } from '@angular/router';
import { Component, Input, ChangeDetectionStrategy, Inject } from '@angular/core';
import { Http, Response, URLSearchParams, RequestOptions, Headers } from '@angular/http';

import { BaseComponent } from '@angular-cms/core';

import { HomePage } from './home.pagetype';

@Component({
    templateUrl: './home.component.html',
})
export class HomeComponent extends BaseComponent<HomePage> {
    constructor() {
        super();
    }
}