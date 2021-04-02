import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: "call"
})
export class CallFunctionPipe implements PipeTransform {
    transform(fnCall: Function, ...args) {
        return fnCall(...args);
    }
}
