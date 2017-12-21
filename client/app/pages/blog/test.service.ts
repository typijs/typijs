import { Injectable, Inject } from '@angular/core';
import { ISelectionFactory, SelectItem } from './../../cms/core/form-elements';

export class TestInjectService {
    log() {
        console.log("This is test inject service");
    }
}

@Injectable()
export class BlogTypeSelectionFactory implements ISelectionFactory {
    constructor(@Inject(TestInjectService) private testService: TestInjectService) {

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
