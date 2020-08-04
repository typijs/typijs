import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PropertiesModule } from '../../properties/properties.module';
import { TableComponent } from './table.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        PropertiesModule
    ],
    declarations: [
        TableComponent
    ],
    exports: [
        TableComponent
    ]
})
export class CrudModule { }
