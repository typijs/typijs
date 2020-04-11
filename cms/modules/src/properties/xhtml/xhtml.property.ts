import { Component, ViewChild } from '@angular/core';
import { CmsProperty, PAGE_TYPE, MEDIA_TYPE } from '@angular-cms/core';
import { DropEvent } from '../../shared/drag-drop/drop-event.model';
import { QuillEditorComponent } from 'ngx-quill';

import './ngx-quill.extension';

@Component({
    selector: '[xhtmlProperty]',
    template: `
        <div class="form-group row" [formGroup]="formGroup">
            <label [attr.for]="id" class="col-sm-4 col-form-label">{{label}}</label>
            <div class="col-sm-8">
                <div droppable (onDrop)="onDropItem($event)">
                    <quill-editor
                        #editor
                        [styles]="{'height': '250px'}"
                        [formControlName]="propertyName"></quill-editor>
                </div>
            </div>
        </div>
    `
})
export class XHtmlProperty extends CmsProperty {
    @ViewChild('editor', { static: true }) editor: QuillEditorComponent;


    onDropItem(e: DropEvent) {
        const { type } = e.dragData;
        switch (type) {
            case PAGE_TYPE:
                this.insertPageUrl(e.dragData);
                break;
            case MEDIA_TYPE:
                this.insertImageUrl(e.dragData);
                break;
        }
    }

    private insertImageUrl(dragData) {
        const { _id, name } = dragData;
        const src = `http://localhost:3000/api/assets/${_id}/${name}`;
        const insertOps = [
            { insert: { image: src }, attributes: { width: '150' } }
        ]
        this.editor.insertAtCursorPosition(insertOps);
    }

    private insertPageUrl(dragData) {
        const { name, linkUrl } = dragData;
        const insertOps = [
            { insert: name, attributes: { link: linkUrl } }
        ]
        this.editor.insertAtCursorPosition(insertOps);
    }
}