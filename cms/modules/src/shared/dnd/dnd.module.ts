import { NgModule, ModuleWithProviders } from '@angular/core';
import { DndService } from './dnd.service';
import { Droppable, } from './droppable.directive';
import { Draggable } from './draggable.directive';
import { DndPlaceholder } from './dnd-placeholder.directive';

@NgModule({
  declarations: [
    Draggable,
    Droppable,
    DndPlaceholder
  ],
  exports: [
    Draggable,
    Droppable,
    DndPlaceholder
  ]
})
export class DndModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DndModule,
      providers: [DndService]
    };
  }
}