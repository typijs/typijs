import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { AuthService } from '../auth.service'

@Component({
    template: `<p>Logging out...</p>`,
})
export class CmsLogoutComponent implements OnInit {
    constructor(private router: Router, private authService: AuthService) { }

    ngOnInit() {
        if (this.authService.isLoggedIn) {
            this.authService.logout();
            this.router.navigate(['/login'])
        } else {
            this.router.navigate(['/'])
        }
    }
}