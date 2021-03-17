import { Component } from '@angular/core';
import { CmsComponent } from '@angular-cms/core';
import { HomePage } from './home.pagetype';
import { ScriptJsService } from '../../shared/scriptjs.service';
@Component({
    selector: '[home-page]',
    templateUrl: './home.component.html',
})
export class HomeComponent extends CmsComponent<HomePage> {
    constructor(private scriptJs: ScriptJsService) {
        super();
    }

    contentLoaded(value: string) {
        this.scriptJs.loadScript('assets/js/secondary.js');
    }
}
