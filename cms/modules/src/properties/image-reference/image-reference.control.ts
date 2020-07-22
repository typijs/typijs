import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CmsImage, MediaService, MEDIA_TYPE } from '@angular-cms/core';
import { DropEvent } from '../../shared/drag-drop/drop-event.model';
import { CmsControl } from '../cms-control';

const IMAGE_REFERENCE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ImageReferenceControl),
    multi: true
}

@Component({
    selector: 'image-reference',
    template: `
        <div class="image-reference border">
            <div class="p-1 drop-area" droppable [dropScope]="isDropAllowed" (onDrop)="onDropImage($event)">
                <div class="d-flex align-items-center p-1 bg-light rounded" *ngIf="model">
                    <img class="mr-2 rounded" [src]="model.thumbnail" />
                    <div class="w-100 mr-2 text-truncate">{{model.alt}}</div>
                    <fa-icon class="ml-auto mr-1" [icon]="['fas', 'times']" (click)="removeImage()"></fa-icon>
                </div>
                <div dragPlaceholder></div>
            </div>
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
    model: CmsImage;

    constructor(private mediaService: MediaService) {
        super();
    }

    writeValue(value: CmsImage): void {
        this.model = value;
    }

    onDropImage(e: DropEvent) {
        const { _id, name, link, thumbnail } = e.dragData;
        this.model = <CmsImage>{
            alt: name,
            //src: this.mediaService.getImageUrl(_id, name)
            src: link,
            thumbnail
        }
        this.onChange(this.model);
    }

    isDropAllowed = (dragData) => {
        if (!dragData) return false;
        const { contentType, type } = dragData;

        return contentType == 'ImageContent' && type == MEDIA_TYPE
    }

    removeImage() {
        this.model = null;
    }
}