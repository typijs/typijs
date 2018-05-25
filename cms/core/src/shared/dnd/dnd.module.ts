import { NgModule, ModuleWithProviders } from '@angular/core';
import { DndService } from './dnd.service';
import { Droppable } from './droppable.directive';
import { Draggable } from './draggable.directive';

@NgModule({
  imports: [],
  declarations: [
    Draggable,
    Droppable
  ],
  exports: [
    Draggable,
    Droppable
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