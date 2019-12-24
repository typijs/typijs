import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { CoreModule } from '@angular-cms/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CoreModule
    ],
    entryComponents: [
        HomeComponent
    ],
    declarations: [
        HomeComponent
    ]
})
export class PagesModule { }