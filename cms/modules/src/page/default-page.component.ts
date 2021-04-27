import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SiteDefinition } from '@typijs/core';

@Component({
    template: `Redirecting to start page`
})
export class DefaultPageComponent implements OnInit {
    constructor(private router: Router, private route: ActivatedRoute, private siteDefinition: SiteDefinition) { }

    ngOnInit() {
        this.siteDefinition.getSiteDefinition().subscribe(([startPageId, language]) => {
            if (startPageId.id !== '0') { this.router.navigate(['content/page', startPageId.id], { relativeTo: this.route }); }
        });
    }
}
