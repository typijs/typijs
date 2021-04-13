import { ClassOf, ContentTypeProperty, ContentTypeService } from '@angular-cms/core';
import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { DndService } from '../../shared/drag-drop/dnd.service';
import { CmsListControl } from '../cms-list.control';
import { ObjectDetailsComponent } from './object-details.component';

const OBJECT_LIST_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ObjectListControl),
    multi: true
};

@Component({
    selector: 'object-list',
    template: `
        <cms-sortable [items]="model" (itemSorted)="itemSorted($event)">
            <ng-template #itemTemplate let-item>
                <div class="d-flex align-items-center">
                    <fa-icon class="mr-1" [icon]="['fas', 'hashtag']"></fa-icon>
                    <div class="ml-2">
                        <pre class="m-0" id="json">{{prettyStringify.bind(this) | callFn:item}}</pre>
                    </div>
                    <div class="hover-menu ml-auto" dropdown container="body">
                        <fa-icon class="mr-1" [icon]="['fas', 'bars']" dropdownToggle></fa-icon>
                        <div class="cms-dropdown-menu dropdown-menu dropdown-menu-right"
                            *dropdownMenu>
                            <a class="dropdown-item p-2" href="javascript:void(0)" (click)="openObjectDetailsModal(item)">
                                Edit
                            </a>
                            <a class="dropdown-item p-2" href="javascript:void(0)" (click)="removeItem(item.guid)">
                                Remove
                            </a>
                        </div>
                    </div>
                </div>
            </ng-template>

            <ng-template #placeholderTemplate>
                <a href="javascript:void(0)" (click)="openObjectDetailsModal()">
                    Add Item
                </a>
            </ng-template>
        </cms-sortable>
    `,
    styles: [`
        .content-area .list-group{
            min-height: 80px;
        }
    `],
    // To isolate drop area of element, provide the separate instance of DndService for this element
    providers: [OBJECT_LIST_VALUE_ACCESSOR, DndService]
})
export class ObjectListControl extends CmsListControl {
    @Input()
    get itemType(): ClassOf<any> {
        return this._itemType;
    }
    set itemType(value: ClassOf<any>) {
        this._itemType = value;
        if (this._itemType) {
            this.properties = this.contentTypeService.getContentTypeProperties(value);
        }
    }
    private _itemType: ClassOf<any>;

    private properties: ContentTypeProperty[];

    constructor(private modalService: BsModalService, private contentTypeService: ContentTypeService) {
        super();
    }

    openObjectDetailsModal(item?: { [key: string]: any }) {
        const initialState = {
            itemType: this.itemType,
            itemData: item ?? {},
            title: item ? 'Item Detail' : 'Create Item'
        };
        const config: ModalOptions<ObjectDetailsComponent> = {
            initialState,
            backdrop: true, // Show backdrop
            keyboard: false, // Esc button option
            ignoreBackdropClick: true, // Backdrop click to hide,
            animated: false,
            class: 'modal-md'
        };

        this.modalService.show(ObjectDetailsComponent, config).content.getResult().subscribe(editedItem => {
            this.insertOrUpdateItem(editedItem);
        });
    }

    prettyStringify(objectItem): string {
        const prettyObject = {};
        this.properties.forEach(element => {
            const key = element.metadata?.displayName ?? element.name;
            prettyObject[key] = objectItem[element.name];
        });
        return JSON.stringify(prettyObject, undefined, 2);
    }
}
