import { AngularCms, AuthModule, PAGE_AFTER_INIT } from '@angular-cms/core';
import { DOCUMENT } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, RendererFactory2 } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BlocksModule } from './blocks/block.module';
import { PagesModule } from './pages/pages.module';
import * as contentTypes from './register-content-types';
import { LayoutComponent } from './shared/layout/layout.component';



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
        { provide: PAGE_AFTER_INIT, useFactory: pageAfterViewInit, deps: [RendererFactory2, DOCUMENT], multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
