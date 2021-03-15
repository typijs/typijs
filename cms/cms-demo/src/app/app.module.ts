import { AngularCms, AuthModule, PAGE_AFTER_INIT } from '@angular-cms/core';
import { DOCUMENT } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApplicationRef, NgModule, RendererFactory2 } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BlocksModule } from './blocks/block.module';
import { PagesModule } from './pages/pages.module';
import * as contentTypes from './register-content-types';
import { LayoutComponent } from './shared/layout/layout.component';
import { NavbarComponent } from './shared/layout/navbar.component';

AngularCms.registerContentTypes(contentTypes);

// Use a factory that return an array of dependant functions to be executed
export function pageAfterViewInit(rendererFactory: RendererFactory2, document: Document) {
    return () => {
        const renderer = rendererFactory.createRenderer(null, null);
        const existedScript = document.getElementById('secondary-js');
        if (existedScript) {
            renderer.removeChild(document.body, existedScript);
        }
        const script = renderer.createElement('script');
        script.id = 'secondary-js';
        script.type = 'text/javascript';
        script.src = 'assets/js/secondary.js';
        renderer.appendChild(document.body, script);
    };
}

@NgModule({
    imports: [
        BrowserAnimationsModule,
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        TransferHttpCacheModule,
        HttpClientModule,
        BsDropdownModule.forRoot(),
        AngularCms.forRoot(),
        AuthModule,
        AppRoutingModule,
        PagesModule,
        BlocksModule
    ],
    declarations: [
        AppComponent,
        LayoutComponent,
        NavbarComponent
    ],
    providers: [
        //{ provide: PAGE_AFTER_INIT, useFactory: pageAfterViewInit, deps: [RendererFactory2, DOCUMENT], multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(applicationRef: ApplicationRef) {
        // https://medium.com/@dmitrymogilko/profiling-angular-change-detection-c00605862b9f
        const originalTick = applicationRef.tick;
        applicationRef.tick = function () {
            const windowPerfomance = window.performance;
            const before = windowPerfomance.now();
            const retValue = originalTick.apply(this, arguments);
            const after = windowPerfomance.now();
            const runTime = after - before;
            window.console.log('CHANGE DETECTION TIME', runTime);
            return retValue;
        };
    }
}
