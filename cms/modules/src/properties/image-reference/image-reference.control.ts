import { CmsImage, ContentReference, ContentTypeEnum } from '@typijs/core';
import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DropEvent } from '../../shared/drag-drop/drop-event.model';
import { CmsControl } from '../cms-control';
import { ContentModalService } from '../../content-modal/content-modal.service';

const IMAGE_REFERENCE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ImageReferenceControl),
    multi: true
};

@Component({
    selector: 'image-reference',
    template: `
    <div class="d-flex align-items-center">
        <div class="image-reference border w-100 mr-1">
            <div class="p-1 drop-area" droppable [dropScope]="isDropAllowed" (onDrop)="onDropImage($event)">
                <div class="d-flex align-items-center p-1 bg-light rounded" *ngIf="model">
                    <img class="mr-2 rounded" [src]="model.thumbnail | toImgSrc" />
                    <div class="w-100 mr-2 text-truncate">{{model.alt}}</div>
                    <fa-icon class="ml-auto mr-1" [icon]="['fas', 'times']" (click)="removeImage()"></fa-icon>
                </div>
                <div dragPlaceholder></div>
            </div>
        </div>
        <button type="button" class="btn btn-primary ml-auto" (click)="openMediaDialog()">...</button>
    </div>
    `,
    styles: [`
        .image-reference .drop-area {
            min-height: 38.5px;
        }
    `],
    providers: [IMAGE_REFERENCE_VALUE_ACCESSOR]
})
export class ImageReferenceControl extends CmsControl {
    model: CmsImage & ContentReference;

    constructor(private contentModalService: ContentModalService) {
        super();
    }

    writeValue(value: CmsImage & ContentReference): void {
        this.model = value;
    }

    onDropImage(e: DropEvent) {
        const { name, linkUrl, thumbnail, _id, id, type, contentType } = e.dragData;
        this.model = <CmsImage & ContentReference>{
            alt: name,
            src: linkUrl,
            thumbnail,
            id: _id ? _id : id,
            type,
            name,
            contentType
        };
        this.onChange(this.model);
    }

    isDropAllowed = (dragData) => {
        if (!dragData) { return false; }
        const { contentType, type } = dragData;

        return contentType == 'ImageContent' && type == ContentTypeEnum.Media;
    }

    removeImage() {
        this.model = null;
    }

    openMediaDialog() {
        this.contentModalService.openMediaDialog(this.model?.id).subscribe(
            selectedMedia => {
                this.model = selectedMedia;
                this.onChange(this.model);
            }
        );
    }
}
