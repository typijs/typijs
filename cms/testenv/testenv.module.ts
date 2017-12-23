import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { TestenvContainer } from './testenv.container';
import { CmsModule } from '../src/cms.module';

@NgModule({
    declarations: [
        TestenvContainer
    ],
    imports: [
        CmsModule,
        BrowserModule,
        FormsModule,
        HttpModule,
    ],
    providers: [],
    bootstrap: [TestenvContainer]
})
export class TestenvModule {
}
