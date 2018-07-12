import { NgModule } from '@angular/core';
import { TestComponent } from './test.component';
import { CommonModule } from '@angular/common';
import { TestWidget } from './test.widget';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        TestComponent,
        TestWidget
    ],
    exports: [
        TestWidget,
        TestComponent
    ],
    entryComponents: [
        TestWidget
    ]
  })
export class TestModule {

 }
