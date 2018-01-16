import { Injectable, Inject } from '@angular/core';
import { ISelectionFactory, SelectItem } from '@angular-cms/core';

@Injectable()
export class BlogTypeSelectionFactory implements ISelectionFactory {
    GetSelections(): SelectItem[] {
        let blogTypes: SelectItem[] = [];
        blogTypes.push(<SelectItem>{
            text: "text 1",
            value: "value 1"
        })

        blogTypes.push(<SelectItem>{
            text: "text 2",
            value: "value 2"
        })

        blogTypes.push(<SelectItem>{
            text: "text 3",
            value: "value 3"
        })

        blogTypes.push(<SelectItem>{
            text: "text 4",
            value: "value 4"
        })
        return blogTypes;
    }
}
