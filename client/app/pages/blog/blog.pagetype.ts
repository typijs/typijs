import { Injectable } from '@angular/core';
import { BlogComponent } from './blog.component';
import { Property, PageType, ValidationTypes } from './../../cms/core/decorators';
import { ISelectionFactory, SelectItem } from './../../cms/core/form-elements';
import { TestInjectService } from './test.service';
import { PageData } from '../../cms/core/bases/page-data';
import { UIType } from '../../cms/core/index';
import { BannerItem, ImageItem } from './banner-item';


@Injectable()
export class BlogTypeSelectionFactory implements ISelectionFactory {
    constructor(private testService: TestInjectService) {

    }
    GetSelections(): SelectItem[] {
        this.testService.log();
        let blogTypes: SelectItem[] = [];
        blogTypes.push(<SelectItem>{
            text: "text 1",
            value: "value 1"
        })

        blogTypes.push(<SelectItem>{
            text: "text 2",
            value: "value 2"
        })
        return blogTypes;
    }
}

@PageType({
    displayName: "Blog Page Type",
    componentRef: BlogComponent,
    description: "This is blog page type"
})
export class Blog extends PageData {

    @Property({
        displayName: "Title",
        displayType: UIType.Input,
        validates: [
            ValidationTypes.required("This is min required"),
            ValidationTypes.minLength(1, "This is min message"),
            ValidationTypes.maxLength(10, "This is max message")]
    })
    title: string;

    @Property({
        displayName: "This is content",
        displayType: UIType.Textarea,
        validates: [ValidationTypes.required("This is min required")]
    })
    content: string;

    @Property({
        displayName: "This is blog type",
        displayType: UIType.Select,
        selectionFactory: BlogTypeSelectionFactory
    })
    blogType: string;

    @Property({
        displayName: "This is banner",
        displayType: UIType.PropertyList,
        propertyListItemType: BannerItem,
    })
    banners: Array<BannerItem>

    @Property({
        displayName: "Images",
        displayType: UIType.PropertyList,
        propertyListItemType: ImageItem,
    })
    images: Array<ImageItem>
}