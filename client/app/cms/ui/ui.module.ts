import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ContentFormEditComponent } from './content-form-edit/content-form-edit.component';
import { InsertPointDirective } from './../core/directives';

@NgModule({
    imports: [
        BrowserModule
    ],
    declarations: [
        ContentFormEditComponent,
        InsertPointDirective
    ],
    exports: [
        ContentFormEditComponent,
        InsertPointDirective
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UIModule { }
