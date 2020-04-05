import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CmsImage } from '@angular-cms/core';
import { CmsControl } from '../cms-control';

@Component({
    selector: 'image-reference',
    template: `
        <div class="image-reference border">
            <div class="p-1 drop-area" droppable [dropScope]="isDropAllowed" (onDrop)="onDropImage($event)">
                <div class="d-flex align-items-center p-1 bg-light rounded" *ngIf="model">
                    <img class="mr-2 rounded" [src]="model.src + '?h=50'" />
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
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ImageReferenceControl),
            multi: true
        }
    ]
})
export class ImageReferenceControl extends CmsControl {
    model: CmsImage;

    writeValue(value: CmsImage): void {
        this.model = value;
    }

    onDropImage(e: any) {
        const { _id, name } = e.dragData;
        this.model = <CmsImage>{
            alt: name,
            src: `http://localhost:3000/api/assets/${_id}/${name}`
        }
        this.onChange(this.model);
    }

    isDropAllowed = (dragData) => {
        if (!dragData.extendProperties) return false;
        const { contentType, type } = dragData.extendProperties;

        return contentType == 'ImageContent' && type == "media"
    }

    removeImage() {
        this.model = null;
    }
}