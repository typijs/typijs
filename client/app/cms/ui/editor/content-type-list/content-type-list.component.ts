import { Component, Input, Inject } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

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
    subParams: Subscription;
    parentId: string;

    constructor(private contentService: ContentService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        this.pageName = "New Page";

        Object.keys(CMS.PAGE_TYPES).map(key => CMS.PAGE_TYPES[key]).forEach(pageType => {
            let pageTypeMetadata = Reflect.getMetadata(PAGE_TYPE_METADATA_KEY, pageType);

            this.contentTypes.push({
                typeRef: pageType,
                metadata: pageTypeMetadata,
            })
        });

        this.subParams = this.route.params.subscribe(params => {
            this.parentId = params['id'] || undefined;
        })
    }

    createNewPage(contentType) {
        if (this.pageName) {
            let content: Content = {
                name: this.pageName,
                contentType: contentType.typeRef.name,
                parentId: this.parentId,
                nameInUrl: slugify(this.pageName)
            }
            //TODO: need to check unique url in parent
            this.contentService.addContent(content).subscribe(
                res => {
                    console.log(res);
                    this.router.navigate(["/cms/editor/content/", res._id])
                },
                error => console.log(error)
            )
        }
    }
}