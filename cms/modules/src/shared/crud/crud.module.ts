import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PropertiesModule } from '../../properties/properties.module';
import { DataTableComponent } from './datatable.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        PropertiesModule
    ],
    declarations: [
        DataTableComponent
    ],
    exports: [
        DataTableComponent
    ]
})
export class CrudModule { }
