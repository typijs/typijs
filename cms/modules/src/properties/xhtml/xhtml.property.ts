import { Component, ViewChild } from '@angular/core';
import Quill from 'quill'
import { QuillEditorComponent } from 'ngx-quill';

import { CmsProperty, PAGE_TYPE, MEDIA_TYPE } from '@angular-cms/core';
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

    constructor() {
        super();
        //TODO how using inline style in quill editor
        console.log(Quill.imports);
    }

    onDropItem(e: DropEvent) {
        const { type, extendProperties } = e.dragData;
        const typeOfContent = extendProperties ? extendProperties.type : type;
        switch (typeOfContent) {
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
        this.quillInsertAtCursorPosition(this.editor.quillEditor, insertOps);
    }

    private insertPageUrl(dragData) {
        const { name, extendProperties } = dragData;
        const insertOps = [
            { insert: name, attributes: { link: extendProperties.linkUrl } }
        ]
        this.quillInsertAtCursorPosition(this.editor.quillEditor, insertOps);
    }

    private quillInsertAtCursorPosition(quillEditor: any, insertOperators: { insert: any, attributes: any }[]) {
        if (!quillEditor) return;

        const operators: any[] = [];
        const range = quillEditor.getSelection(true);
        if (range.index > 0) operators.push({ retain: range.index });

        insertOperators.forEach(insert => operators.push(insert));
        quillEditor.updateContents({ ops: operators });
    }
}