import { CoreModule } from '@angular-cms/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PropertiesModule } from '../../properties/properties.module';
import { DataTableComponent } from './datatable.component';
import { DynamicFormComponent } from './dynamic-form.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        CoreModule,
        PropertiesModule
    ],
    declarations: [
        DataTableComponent,
        DynamicFormComponent
    ],
    exports: [
        DataTableComponent,
        DynamicFormComponent
    ]
})
export class CrudModule { }
