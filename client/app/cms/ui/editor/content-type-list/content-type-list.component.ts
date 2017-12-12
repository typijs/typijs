import { Component, Input, Inject } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

import CMS from '../../../core';
import { PAGE_TYPE_METADATA_KEY, PROPERTY_METADATA_KEY, PROPERTIES_METADATA_KEY } from './../../../core/constants';
import { ContentService } from './../../../core/services';
import { Content } from './../../../core/models/content.model';
import { slugify } from './../../../core/util';

@Component({
    templateUrl: './content-type-list.component.html',
})
export class ContentTypeListComponent {
    pageName: string;
    contentTypes: Array<any> = [];

    constructor(private contentService: ContentService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        this.pageName = "New Page";

        CMS.PAGE_TYPES.forEach(pageType => {
            let pageTypeMetadata = Reflect.getMetadata(PAGE_TYPE_METADATA_KEY, pageType);
            
            this.contentTypes.push({
                typeRef: pageType,
                metadata: pageTypeMetadata,
            })
        })
    }

    createNewPage(contentType) {
        if (this.pageName) {
            let content: Content = {
                name: this.pageName,
                contentType: contentType.typeRef.name,
                parentId: "123",
                nameInUrl: slugify(this.pageName)
            }
            this.contentService.addContent(content).subscribe(
                res => {
                    console.log(res);
                    this.router.navigate(["../content/", res._id], {relativeTo: this.route})
                },
                error => console.log(error)
            )
        }
    }
}