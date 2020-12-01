import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Renderer2, RendererFactory2 } from '@angular/core';
import { TransferHttpCacheModule } from '@nguniversal/common';

import { AngularCms, AuthModule, PAGE_AFTER_INIT } from '@angular-cms/core';

import * as contentTypes from './register-content-types';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { PagesModule } from './pages/pages.module';
import { BlocksModule } from './blocks/block.module';
import { HttpClientModule } from '@angular/common/http';

AngularCms.registerContentTypes(contentTypes);

// Use a factory that return an array of dependant functions to be executed
export function pageAfterViewInit(rendererFactory: RendererFactory2) {
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
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        TransferHttpCacheModule,
        HttpClientModule,
        AngularCms.forRoot(),
        AuthModule,
        AppRoutingModule,
        PagesModule,
        BlocksModule
    ],
    declarations: [
        AppComponent,
        LayoutComponent,
    ],
    providers: [
        { provide: PAGE_AFTER_INIT, useFactory: pageAfterViewInit, deps: [RendererFactory2], multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
