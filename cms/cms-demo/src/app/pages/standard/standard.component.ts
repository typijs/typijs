import { CmsComponent, PageService } from '@typijs/core';
import { Component } from '@angular/core';
import { ScriptJsService } from '../../shared/scriptjs.service';
import { StandardPage } from './standard.pagetype';

@Component({
    templateUrl: 'standard.component.html'
})
export class StandardPageComponent extends CmsComponent<StandardPage> {
    constructor(private scriptJs: ScriptJsService) {
        super();
    }

    contentLoaded(value: string) {
        this.scriptJs.loadScript('assets/js/secondary.js');
    }
}
