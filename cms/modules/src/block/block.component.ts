import { Component, Input, ComponentFactoryResolver, Inject, ViewChild, OnDestroy } from '@angular/core';

@Component({
    template: `
        <a href="javascript:void(0)">
            <i class="fa fa-sitemap fa-fw"></i> Blocks
            <span class="fa fa-plus pull-right" [routerLink]="['new/block']"></span>
        </a>`
})
export class BlockComponent {
}