import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ADMIN_ROUTE } from '../../injection-tokens';
import { AuthService } from '../auth.service';


@Component({
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class CmsRegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    error = '';
    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private authService: AuthService,
        @Inject(ADMIN_ROUTE) private adminPath: string) {
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            email: ['', Validators.required]
        });
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        this.authService.setupAdmin(this.f.username.value, this.f.password.value, this.f.email.value)
            .subscribe({
                next: () => {
                    this.router.navigate([this.adminPath]);
                },
                error: error => {
                    this.error = error;
                    this.loading = false;
                }
            });
    }
}
