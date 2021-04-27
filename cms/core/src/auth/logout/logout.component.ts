import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BrowserLocationService } from '../../browser/browser-location.service';

import { AuthService } from '../auth.service';

@Component({
    template: `<p style="text-align: center;">Logging out...</p>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CmsLogoutComponent implements OnInit {
    private readonly homePage: string = '/';
    constructor(private locationService: BrowserLocationService, private authService: AuthService) { }

    ngOnInit() {
        this.authService.logout();
        this.locationService.navigate(this.homePage);
    }
}
