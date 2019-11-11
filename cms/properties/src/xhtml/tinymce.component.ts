import { Component, Input, Output, EventEmitter, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { CmsProperty } from '@angular-cms/core';

import 'tinymce/tinymce.min';
declare var tinymce: any;

import 'tinymce/themes/modern';
import 'tinymce/themes/modern/theme';
import 'tinymce/plugins/link/plugin.js';
import 'tinymce/plugins/paste/plugin.js';
import 'tinymce/plugins/table/plugin.js';
import 'tinymce/plugins/advlist/plugin.js';
import 'tinymce/plugins/autoresize/plugin.js';
import 'tinymce/plugins/lists/plugin.js';
import 'tinymce/plugins/code/plugin.js';

import { HiddenInputControl } from './hidden-input';

@Component({
    template: `
        <div class="form-group row" [formGroup]="formGroup">
            <label [attr.for]="id" class="col-sm-4 col-form-label">{{label}}</label>
            <div class="col-sm-8">
                <hidden-input [formControlName]="propertyName"></hidden-input>
                <textarea class="form-control" rows="4" [id]="id"></textarea>
            </div>
        </div>
    `
})
export class TinymceComponent extends CmsProperty implements AfterViewInit, OnDestroy {

    @ViewChild(HiddenInputControl, { static: false }) hiddenControl: HiddenInputControl;

    editor: any;

    ngAfterViewInit() {
        tinymce.init({
            selector: '#' + this.id,
            plugins: ['link', 'table', 'code'],
            min_height: 180,
            skin_url: '/assets/tinymce/skins/lightgray',
            setup: editor => {
                this.editor = editor;
                editor.on('keyup change', () => {
                    const content = editor.getContent();
                    this.hiddenControl.set(content);
                });
            },
            init_instance_callback: editor => {
                if (this.formGroup.controls[this.propertyName].value)
                    this.editor.setContent(this.formGroup.controls[this.propertyName].value);
            }
        });
    }

    ngOnDestroy() {
        tinymce.remove(this.editor);
    }
}