import { NgModule, ModuleWithProviders } from '@angular/core';
import { DndService } from './dnd.service';
import { Droppable, } from './directives/droppable.directive';
import { Draggable } from './directives/draggable.directive';
import { DndPlaceholder } from './directives/dnd-placeholder.directive';

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