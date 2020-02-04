import { Component } from '@angular/core';
import { CmsComponent } from '@angular-cms/core';
import { FeatureBlock } from './feature.blocktype';

@Component({
    templateUrl: 'feature.component.html'
})

export class FeatureComponent extends CmsComponent<FeatureBlock> {
    constructor() {
        super();
    }
}