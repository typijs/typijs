import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'content-settings',
    template: `
    <div [formGroup]="formGroup">
        <div class="form-group row">
            <label for="startPublish" class="col-3 col-form-label">Published</label>
            <div class="col-5">
                <input type="text" class="form-control" id="startPublish" name="startPublish" formControlName="startPublish" />
            </div>
        </div>
        <div class="form-group row">
            <label for="createdAt" class="col-3 col-form-label">Created</label>
            <div class="col-5">
                <input type="text" class="form-control" id="createdAt" name="createdAt" formControlName="createdAt" />
            </div>
        </div>
        <div class="form-group row">
            <label for="updatedAt" class="col-3 col-form-label">Modified</label>
            <div class="col-5">
                <input type="text" class="form-control" id="updatedAt" name="updatedAt" formControlName="updatedAt" />
            </div>
        </div>
        <div class="form-group row">
            <label for="childOrderRule" class="col-3 col-form-label">Sort subpages</label>
            <div class="col-5">
                <input type="text" class="form-control" id="childOrderRule" name="childOrderRule" formControlName="childOrderRule" />
            </div>
        </div>
        <div class="form-group row">
            <label for="peerOrder" class="col-3 col-form-label">Sort index</label>
            <div class="col-5">
                <input type="text" class="form-control" id="peerOrder" name="peerOrder" formControlName="peerOrder" />
            </div>
        </div>
    </div>
    `
})
export class ContentSettingsComponent {
    @Input() formGroup: FormGroup;
    @Output() output: EventEmitter<any> = new EventEmitter();
}
