import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class DndService {
    dragData: any;
    scope: string | Array<string>;
    onDragStart = new Subject<any>();
    onDragEnd = new Subject<any>();
}