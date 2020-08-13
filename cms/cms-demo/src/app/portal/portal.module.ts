import { NgModule } from '@angular/core';

import { PROPERTY_FACTORIES } from '@angular-cms/core';
import { CmsPortalModule } from '@angular-cms/portal';
import { NgxWigModule } from 'ngx-wig';
import { NgxWigPropertyFactory } from './xhtml/wig.factory';
import { NgxWigProperty } from './xhtml/wig.property';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomModule } from './lazy/custom.module';

@NgModule({
    imports: [
        ReactiveFormsModule,
        NgxWigModule,
        CmsPortalModule.forRoot()
    ],
    declarations: [
        NgxWigProperty
    ],
    entryComponents: [
        NgxWigProperty
    ],
    providers: [
        //Override the default xhtml property, using the ngx-wig instead of ngx-quill
        { provide: PROPERTY_FACTORIES, useClass: NgxWigPropertyFactory, multi: true }
    ]
})
export class PortalModule { }
