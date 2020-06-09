import { NgModule, ModuleWithProviders } from '@angular/core';
import { DndService } from './dnd.service';
import { Droppable, } from './directives/droppable.directive';
import { Draggable } from './directives/draggable.directive';
import { DragPlaceholder } from './directives/drag-placeholder.directive';
import { DragHandle } from './directives/drag-handle.directive';

@NgModule({
  declarations: [
    Draggable,
    Droppable,
    DragPlaceholder,
    DragHandle
  ],
  exports: [
    Draggable,
    Droppable,
    DragPlaceholder,
    DragHandle
  ]
})
export class DndModule {
  static forRoot(): ModuleWithProviders<DndModule> {
    return {
      ngModule: DndModule,
      providers: [DndService]
    };
  }
}