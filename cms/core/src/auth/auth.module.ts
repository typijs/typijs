import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CmsLoginComponent } from './login/login.component';
import { CmsLogoutComponent } from './logout/logout.component';
import { CmsRegisterComponent } from './register/register.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [CmsLoginComponent, CmsLogoutComponent, CmsRegisterComponent],
    declarations: [CmsLoginComponent, CmsLogoutComponent, CmsRegisterComponent],
})
export class AuthModule { }
