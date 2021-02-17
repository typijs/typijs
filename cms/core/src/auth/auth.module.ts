import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CmsLoginComponent } from './login/login.component';
import { CmsLogoutComponent } from './logout/logout.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [CmsLoginComponent, CmsLogoutComponent],
    declarations: [CmsLoginComponent, CmsLogoutComponent],
})
export class AuthModule { }
