import { Pipe, PipeTransform } from '@angular/core';

/**
 * The pipe to execute the function on template without impact change detection
 *
 * Usage:
 *
 * ``` typescript
 * export class AComponent {
 *  value: number = 100;
 *  value1: number = 1;
 *  value2: number = 2;
 *
 *  plus(arg1, arg2) { return arg1 + arg2; }
 *  // using this in function. Need binding context when call in template using pipe
 *  minus(arg) { return this.value - arg}
 * }
 *
 * ```
 * #Template:
 * ``` html
 * <div>{{ plus | callFn:value1:value2 }}</div>
 * <!-- Binding context -->
 * <div>{{ minus.bind(this) | callFn:10 }}</div>
 * ```
 * #Output:
 * ``` html
 * <div>2</div>
 * <div>90</div>
 *
 * ```
 */
@Pipe({
    name: 'callFn'
})
export class CallFunctionPipe implements PipeTransform {
    transform(fnCall: (...params: any[]) => any, ...args) {
        return fnCall(...args);
    }
}
