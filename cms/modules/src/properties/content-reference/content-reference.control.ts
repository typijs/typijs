import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PAGE_TYPE, ContentReference } from '@angular-cms/core';

import { DropEvent } from '../../shared/drag-drop/drop-event.model';
import { SubjectService } from '../../shared/services/subject.service';
import { ContentAreaItem } from '../content-area/content-area.model';
import { CmsControl } from '../cms-control';

const CONTENT_REFERENCE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ContentReferenceControl),
    multi: true
};

@Component({
    selector: 'content-reference',
    template: `
        <div class="content-reference border">
            <div class="p-1 drop-area" droppable [dropScope]="isDropAllowed" (onDrop)="onDropContent($event)">
                <div class="d-flex align-items-center p-1 bg-light rounded" *ngIf="model">
                    <fa-icon class="mr-1" [icon]="['fas', 'file']"></fa-icon>
                    <div class="w-100 mr-2 text-truncate">{{model.name}}</div>
                    <fa-icon class="ml-auto mr-1" [icon]="['fas', 'times']" (click)="removeContent()"></fa-icon>
                </div>
                <div dragPlaceholder></div>
            </div>
        </div>
    `,
    styles: [`
        .content-reference .drop-area {
            min-height: 38.5px;
        }
    `],
    providers: [CONTENT_REFERENCE_VALUE_ACCESSOR]
})
export class ContentReferenceControl extends CmsControl {
    @Input() allowedTypes: string[];
    model: ContentReference;

    constructor(private subjectService: SubjectService) {
        super();
    }

    writeValue(value: ContentReference): void {
        this.model = value;
    }

    isDropAllowed = (dragData) => {
        const { contentType, type } = dragData;

        if (!this.allowedTypes) { return type == PAGE_TYPE; }
        return this.allowedTypes.indexOf(contentType) > -1 && type == PAGE_TYPE;
    }

    onDropContent(e: DropEvent) {
        const { _id, id, name, type, contentType, owner, guid } = e.dragData;
        this.model = <ContentReference>{
            id: _id ? _id : id,
            type,
            name,
            contentType
        };

        this.onChange(this.model);

        if (owner && guid) {
            const contentAreaItem: Partial<ContentAreaItem> = {
                owner,
                guid
            };
            this.subjectService.fireContentDropFinished(contentAreaItem);
        }
    }

    removeContent() {
        this.model = null;
    }
}
