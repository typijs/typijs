import { Component } from '@angular/core';
import { CmsPropertyRender } from '../../bases/cms-property';
@Component({
    selector: 'span',
    template: `{{value}}`
})
export class TextRender extends CmsPropertyRender {
    
}