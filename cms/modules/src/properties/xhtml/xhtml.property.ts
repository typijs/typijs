import { Component } from '@angular/core';
import { CmsProperty } from '@angular-cms/core';
import { EventObj } from '@tinymce/tinymce-angular/editor/Events';

@Component({
    selector: '[xhtmlProperty]',
    template: `
        <div class="form-group row" [formGroup]="formGroup">
            <label [attr.for]="id" class="col-sm-4 col-form-label">{{label}}</label>
            <div class="col-sm-8">
                <editor  
                    [id]="id" 
                    [formControlName]="propertyName" 
                    [init]="editorInitObject"
                    (onDrop)="onDrop($event)"></editor>
            </div>
        </div>
    `
})
export class XHtmlProperty extends CmsProperty {
    editorInstance: any;
    editorInitObject: Record<string, any> = {
        base_url: '/tinymce',
        suffix: '.min',
        height: 300,
        setup: editor => {
            this.editorInstance = editor;
            //editor.on("drop", (e) => this.onDropEvent(e));
        }
    };

    onDrop(event: EventObj<DragEvent>) {
        console.log(event);
        const dragData = JSON.parse(event.event.dataTransfer.getData('data'));
        const { _id, name } = dragData;
        const src = `http://localhost:3000/api/assets/${_id}/${name}`;

        this.editorInstance.execCommand('mceInsertContent', false, `<img alt="${name}" height="100" src="${src}" />`)
        event.event.stopImmediatePropagation()
    }
}