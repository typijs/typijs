import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'content-breadcrumb',
    template: `
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb m-0 p-2">
            <li class="breadcrumb-item"><a href="#">Home</a></li>
            <li class="breadcrumb-item active" aria-current="page">Library</li>
        </ol>
    </nav>
    `
})
export class ContentBreadcrumbComponent {
    @Input() input;
    @Output() output: EventEmitter<any> = new EventEmitter();
}
