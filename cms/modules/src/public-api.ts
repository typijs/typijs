/*
 * Public API Surface of modules
 */

// TODO: https://github.com/ng-packagr/ng-packagr/issues/727
// Can not export like that in Angular 8. Need to update to 9
// export * from './shared/libs';
// export * from './shared/drag-drop';

export * from './shared/drag-drop/dnd.module';
export * from './shared/drag-drop/directives/draggable.directive';
export * from './shared/drag-drop/directives/droppable.directive';
export * from './shared/drag-drop/directives/drag-handle.directive';
export * from './shared/drag-drop/directives/drag-placeholder.directive';

export * from './shared/dialog/dialog.module';
export * from './shared/dialog/dialog.service';

export * from './shared/services/subject.service';
export * from './shared/services/dynamic-form.service';

export * from './content/content.module';
export * from './content/content-create/content-create.component';
export * from './content/content-update/content-update.component';

export * from './properties/properties.module';
export * from './properties/text/text.property';
export * from './properties/textarea/textarea.property';
export * from './properties/checkbox/checkbox.property';
export * from './properties/select/dropdown/dropdown.property';
export * from './properties/select/checkbox-list/checkbox-list.property';
export * from './properties/xhtml/xhtml.property';
export * from './properties/object-list/object-list.property';
export * from './properties/content-area/content-area.property';
export * from './properties/content-reference/content-reference.property';
export * from './properties/image-reference/image-reference.property';

export * from './page/page.module';
export * from './page/page-tree.component';

export * from './block/block.module';
export * from './block/block-tree.component';

export * from './media/media.module';
export * from './media/media-tree.component';

export * from './site-definition/site-definition.module';
export * from './site-definition/site-definition.component';

export * from './content-type/content-type.module';
export * from './content-type/content-type-list.component';
export * from './content-type/content-type-detail.component';

export * from './content-version/content-version.module';
export * from './content-version/content-version.component';

export * from './shared/font-icons';
