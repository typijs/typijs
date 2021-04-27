import { Component, ViewChild } from '@angular/core';
import { CmsProperty, ContentTypeEnum, MediaService } from '@typijs/core';
import { QuillEditorComponent } from 'ngx-quill';
import Quill from 'quill';
import { DropEvent } from '../../shared/drag-drop/drop-event.model';
import './quill-inline-style';

// Temp comment since this import is not working with --prod in runtime
// quill Cannot import modules/imageResize. Are you sure it was registered?
// import './quill-modules';

export type InsertOperator = {
    insert: any
    attributes: any
};

@Component({
    selector: '[xhtmlProperty]',
    template: `
        <div class="form-group row" [formGroup]="formGroup">
            <label [attr.for]="id" class="col-3 col-form-label">{{label}}</label>
            <div class="col-8">
                <div droppable (onDrop)="onDropItem($event)">
                    <quill-editor
                        #editor
                        [formControlName]="propertyName"
                        [styles]="{'height': '250px'}"
                        [modules] = "modules"
                        (onEditorCreated)="onEditorCreated($event)"></quill-editor>
                </div>
            </div>
        </div>
    `
})
export class XHtmlProperty extends CmsProperty {
    @ViewChild('editor', { static: true }) editor: QuillEditorComponent;

    modules: { [key: string]: any } = {};
    constructor(private mediaService: MediaService) {
        super();
        // Temp comment since this import is not working with --prod in runtime
        // quill Cannot import modules/imageResize. Are you sure it was registered?
        // this.modules = {
        //     imageResize: {},
        //     //clickMeButton: { handler: this.handleClickMe }
        // }
    }

    handleClickMe(event) {

    }

    onEditorCreated(quill) {
    }

    onDropItem(e: DropEvent) {
        const { type } = e.dragData;
        switch (type) {
            case ContentTypeEnum.Page:
                this.insertPageUrl(e.dragData);
                break;
            case ContentTypeEnum.Media:
                this.insertImageUrl(e.dragData);
                break;
        }
    }

    private insertImageUrl(dragData) {
        const { _id, name } = dragData;
        const src = this.mediaService.getImageUrl(_id, name);
        const insertOps = [
            { insert: { image: src }, attributes: { width: '150' } }
        ];
        this.insertAtCursorPosition(this.editor.quillEditor, insertOps);
    }

    private insertPageUrl(dragData) {
        const { name, linkUrl } = dragData;
        const insertOps = [
            { insert: name, attributes: { link: linkUrl } }
        ];
        this.insertAtCursorPosition(this.editor.quillEditor, insertOps);
    }

    private insertAtCursorPosition(quillEditor: Quill, insertOperators: InsertOperator[]) {
        if (!quillEditor) { return; }

        const operators: any[] = [];
        const range = quillEditor.getSelection(true);
        if (range.index > 0) { operators.push({ retain: range.index }); }

        insertOperators.forEach(insert => operators.push(insert));
        quillEditor.updateContents({ ops: operators } as any);
    };
}
