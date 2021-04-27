import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TypeOfContent } from '@typijs/core';
import { ContentExt } from '../content-crud.service';

@Component({
    selector: 'content-header',
    template: `
    <div [formGroup]="formGroup">
        <dl class="row" *ngIf="currentContent">
            <dt class="col-sm-3">Name</dt>
            <dd class="col-sm-5">
            <input type="text" class="form-control" name="name" formControlName="name">
            </dd>
            <dt class='col-sm-4'></dt>
            <ng-container *ngIf="typeOfContent === 'page'">
                <dt class="col-sm-3">Name in url</dt>
                <dd class="col-sm-5">
                    <input type="text" class="form-control" name="urlSegment" formControlName="urlSegment">
                </dd>
                <dt class='col-sm-4'></dt>

                <dt class="col-sm-3">Link url</dt>
                <dd class="col-sm-9">{{currentContent.linkUrl}}</dd>

                <dt class="col-sm-3"></dt>
                <dd class="col-sm-5">
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="visibleInMenu" name="visibleInMenu" formControlName="visibleInMenu">
                        <label class="form-check-label" for="visibleInMenu">Visible in menu</label>
                    </div>
                </dd>
                <dt class='col-sm-4'></dt>
            </ng-container>
            <dt class="col-sm-3">Type</dt>
            <dd class="col-sm-9">{{currentContent.contentType}}</dd>
        </dl>
    </div>
    `
})
export class ContentHeaderComponent {
    @Input() formGroup: FormGroup;
    @Input() currentContent: ContentExt;
    @Input() typeOfContent: TypeOfContent;
    @Output() output: EventEmitter<any> = new EventEmitter();
}
