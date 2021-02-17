import { generateUUID } from '@angular-cms/core';
import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { DndService } from '../shared/drag-drop/dnd.service';
import { DropEvent } from '../shared/drag-drop/drop-event.model';

@Component({
    selector: 'cms-sortable',
    template: `
        <div class="sortable border">
            <div class="list-group p-2" droppable (onDrop)="onDropItem($event)">
                <a class="list-group-item list-group-item-action rounded mb-1 p-2"
                    href="javascript:void(0)"
                    *ngFor="let item of items;"
                    draggable
                    [dragData]="item">
                    <ng-container
                        [ngTemplateOutlet]="itemTemplate"
                        [ngTemplateOutletContext]="{ $implicit: item, item: item}">
                    </ng-container>
                </a>
                <div class="list-group-item d-flex list-group-item-action rounded mb-1 p-1 bg-info"
                        dragPlaceholder></div>
            </div>
            <p class="text-center" *ngIf="placeholderTemplate">
                <ng-container [ngTemplateOutlet]="placeholderTemplate"></ng-container>
            </p>
        </div>
    `,
    styles: [`
        .sortable .list-group{
            min-height: 80px;
        }
    `],
    providers: [DndService]
})
export class SortableComponent {
    @ContentChild('itemTemplate', { static: true }) itemTemplate: TemplateRef<any>;
    @ContentChild('placeholderTemplate', { static: true }) placeholderTemplate: TemplateRef<any>;

    @Output() itemSorted: EventEmitter<any[]> = new EventEmitter();

    @Input() items: any[];

    onDropItem(e: DropEvent) {
        if (!this.items) { this.items = []; }

        const itemIndex = e.index;
        const item = { ...e.dragData };
        const itemGuid = item.guid;
        // Sort item in content area by dnd
        // Insert new item
        item.guid = generateUUID();
        this.items.splice(itemIndex, 0, item);
        // Remove old item
        this.removeItemFromModel(itemGuid);
        this.itemSorted.emit(this.items);
    }

    private removeItemFromModel(itemGuid: string): boolean {
        const existIndex = this.items.findIndex(x => x.guid == itemGuid);
        if (existIndex === -1) { return false; }

        this.items.splice(existIndex, 1);
        return true;
    }

}
