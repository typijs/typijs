import { QuillEditorComponent } from 'ngx-quill';

export type InsertOperator = {
    insert: any
    attributes: any
};

declare module 'ngx-quill' {
    class QuillEditorComponent {
        insertAtCursorPosition(insertOperators: InsertOperator[]): void;
        [key: string]: any;
    }
}

QuillEditorComponent.prototype.insertAtCursorPosition = function (insertOperators: InsertOperator[]) {
    const quillEditor = this.quillEditor;
    if (!quillEditor) { return; }

    const operators: any[] = [];
    const range = quillEditor.getSelection(true);
    if (range.index > 0) { operators.push({ retain: range.index }); }

    insertOperators.forEach(insert => operators.push(insert));
    quillEditor.updateContents({ ops: operators });
};
