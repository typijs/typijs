import { Component } from '@angular/core';
import { CmsProperty} from '@angular-cms/core';

@Component({
  template: `<h1>This is tag property</h1>
  <div class="form-group row" [formGroup]="formGroup">
        <label [attr.for]="id" class="col-sm-4 col-form-label">{{label}}</label>
        <div class="col-sm-8">
            <input type="text" class="form-control" 
                    [id]="id" 
                    [placeholder]="label"
                    [name]="propertyName"
                    [formControlName]="propertyName">
        </div>
    </div>`
})
export class TagComponent extends CmsProperty{

}
