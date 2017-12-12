import { Injectable } from '@angular/core';
import { BlogComponent } from './blog.component';
import { Property, PageType } from './../../cms/core/decorators';
import { Elements } from './../../cms/core/form-elements';
import { ISelectionFactory, SelectItem } from './../../cms/core/form-elements';
import { TestInjectService } from './test.service';
import { PageBase } from '../../cms/core/base.pagetype';


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
export class Blog extends PageBase {

    @Property({
        displayName: "Title",
        displayType: Elements.Input
    })
    title: string;

    @Property({
        displayName: "This is content",
        displayType: Elements.Textarea
    })
    content: string;

    @Property({
        displayName: "This is blog type",
        displayType: Elements.Select,
        selectionFactory: BlogTypeSelectionFactory
    })
    blogType: string;
}