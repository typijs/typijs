import { Component, ViewChild } from '@angular/core';
import { QuillEditorComponent } from 'ngx-quill';

import { CmsProperty } from '@angular-cms/core';
import { DropEvent } from '../../shared/drag-drop/drop-event.model';

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
    @ViewChild('editor', {
        static: true
    }) editor: QuillEditorComponent

    onDropItem(e: DropEvent) {
        const { _id, id, name, owner, guid, extendProperties, type, contentType, isPublished } = e.dragData;

        const src = `http://localhost:3000/api/assets/${_id}/${name}`;
        if (this.editor.quillEditor) {
            const quillEditor = this.editor.quillEditor;
            const range = quillEditor.getSelection(true);
            quillEditor.insertEmbed(range.index, 'image', src, 'user')
        }
    }
}