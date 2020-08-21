import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class DndService {
    dragData: any;
    scope: string | string[];
    dragStart$ = new Subject<any>();
    dragEnd$ = new Subject<any>();
}
