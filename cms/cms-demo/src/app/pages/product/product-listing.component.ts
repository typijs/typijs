import { CmsComponent, ContentLoader } from '@angular-cms/core';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ProductListingPage } from './product-listing.pagetype';
import { ProductPage } from './product.pagetype';

@Component({
    templateUrl: 'product-listing.component.html',
    styles: [`
        .pagination {
            display: inherit !important;
        }
        .page-item .page-link {
            padding: 0 !important;
            border-top-right-radius: 50% !important;
            border-bottom-right-radius: 50% !important;
            border-top-left-radius: 50% !important;
            border-bottom-left-radius: 50% !important;
        }

        .page-item.active .page-link {
            background:#82ae46 !important;
            border-color: transparent !important;
        }
  `],
    encapsulation: ViewEncapsulation.None
})
export class ProductListingComponent extends CmsComponent<ProductListingPage> implements OnInit {

    categories: Observable<ProductListingPage[]>;
    products: Observable<ProductPage[]>;
    total: number = 0;
    get limit(): number {
        if (this.currentContent.numberItemsPerPage) {
            return parseInt(this.currentContent.numberItemsPerPage);
        }
        return 4;
    }
    pageChanged: BehaviorSubject<number> = new BehaviorSubject(1);
    constructor(private contentLoader: ContentLoader) {
        super();
    }

    ngOnInit(): void {
        const filter = {
            type: this.currentContent.contentLink.type,
            contentType: 'ProductPage',
            parentPath: { $regex: `,${this.currentContent.contentLink.id},` },
            language: this.currentContent.language
        };
        this.products = this.pageChanged.pipe(
            switchMap(page => this.contentLoader.query<ProductPage>(filter, null, null, page, this.limit)),
            tap(result => this.total = result.total),
            map(result => result.docs)
        );
        this.categories = this.contentLoader.query<ProductListingPage>({
            type: this.currentContent.contentLink.type,
            language: this.currentContent.language,
            contentType: 'ProductListingPage',
            parentId: this.currentContent.contentLink.id
        }).pipe(map(result => result.docs))
    }
}
