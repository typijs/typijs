import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'cms-pager',
    template: `
    <ul class="pagination mb-0">
      <li [class.disabled]="!canPrevious()" class="page-item">
        <a role="button" class="page-link" aria-label="go to first page" href="javascript:void(0)" (click)="selectPage(1)">
          first
        </a>
      </li>
      <li [class.disabled]="!canPrevious()" class="page-item">
        <a role="button" class="page-link" aria-label="go to previous page" href="javascript:void(0)" (click)="prevPage()">
          prev
        </a>
      </li>
      <li
        role="button"
        [attr.aria-label]="'page ' + pg.number"
        class="page-item"
        *ngFor="let pg of pages"
        [class.active]="pg.number === page">
        <a href="javascript:void(0)" class="page-link" (click)="selectPage(pg.number)">
          {{ pg.text }}
        </a>
      </li>
      <li [class.disabled]="!canNext()" class="page-item">
        <a role="button" class="page-link" aria-label="go to next page" href="javascript:void(0)" (click)="nextPage()">
          next
        </a>
      </li>
      <li [class.disabled]="!canNext()" class="page-item">
        <a role="button" class="page-link" aria-label="go to last page" href="javascript:void(0)" (click)="selectPage(totalPages)">
          last
        </a>
      </li>
    </ul>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicTablePagerComponent {

    /**
     * The page size
     */
    @Input()
    get pageSize(): number {
        return this._pageSize;
    }
    set pageSize(val: number) {
        this._pageSize = val;
        this.pages = this.calcPages();
    }

    /**
     * The total number items
     */
    @Input()
    get count(): number {
        return this._count;
    }
    set count(val: number) {
        this._count = val;
        this.pages = this.calcPages();
    }

    /**
     * The current page number
     */
    @Input()
    get page(): number {
        return this._page;
    }
    set page(val: number) {
        this._page = val;
        this.pages = this.calcPages();
    }

    get totalPages(): number {
        const count = this.pageSize < 1 ? 1 : Math.ceil(this.count / this.pageSize);
        return Math.max(count || 0, 1);
    }

    @Output() change: EventEmitter<any> = new EventEmitter();

    private _count: number = 0;
    private _page: number = 1;
    private _pageSize: number = 0;
    pages: any;

    canPrevious(): boolean {
        return this.page > 1;
    }

    canNext(): boolean {
        return this.page < this.totalPages;
    }

    prevPage(): void {
        this.selectPage(this.page - 1);
    }

    nextPage(): void {
        this.selectPage(this.page + 1);
    }

    selectPage(page: number): void {
        if (page > 0 && page <= this.totalPages && page !== this.page) {
            this.page = page;

            this.change.emit({
                page
            });
        }
    }

    calcPages(page?: number): any[] {
        const pages = [];
        let startPage = 1;
        let endPage = this.totalPages;
        const maxSize = 5;
        const isMaxSized = maxSize < this.totalPages;

        page = page || this.page;

        if (isMaxSized) {
            startPage = page - Math.floor(maxSize / 2);
            endPage = page + Math.floor(maxSize / 2);

            if (startPage < 1) {
                startPage = 1;
                endPage = Math.min(startPage + maxSize - 1, this.totalPages);
            } else if (endPage > this.totalPages) {
                startPage = Math.max(this.totalPages - maxSize + 1, 1);
                endPage = this.totalPages;
            }
        }

        for (let num = startPage; num <= endPage; num++) {
            pages.push({
                number: num,
                text: <string>(<any>num)
            });
        }

        return pages;
    }
}
