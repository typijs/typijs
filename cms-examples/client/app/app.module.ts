import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ComponentFactoryResolver } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AngularCmsModule, CmsModuleRoot, CmsWidgetPosition } from '@angular-cms/core';

import { PagesModule } from './pages/pages.module';
import { BlocksModule } from './blocks/blocks.module';

import * as contentTypes from './registerContentTypes';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';

import { LayoutComponent } from './shared/layout/layout.component';
import { BlogTypeSelectionFactory } from './pages/blog/blog-type-selection.factory';
import { TestComponent } from './test.component';
import { TestModule } from './test.module';
import { TagComponent } from './properties/tag/tag.component';
import { TestWidget } from './test.widget';

//AngularCmsModule.registerProperty(TagComponent, "Tag");
AngularCmsModule.registerContentTypes(contentTypes);
// AngularCmsModule.registerModule({
//   module: TestModule,
//   root: CmsModuleRoot.Editor,
//   routes: [
//     {
//       path: 'test', //type is 'block' or 'page'
//       component: TestComponent
//     }
//   ],
//   widgets: [
//     {
//       component: TestWidget,
//       position: CmsWidgetPosition.Left,
//       group: 'Pages'
//     }
//   ]
// })

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PagesModule,
    BlocksModule,
    AngularCmsModule.forRoot(),
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    LayoutComponent,
    TagComponent
  ],
  providers: [
    BlogTypeSelectionFactory
  ],
  entryComponents: [
    TagComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
