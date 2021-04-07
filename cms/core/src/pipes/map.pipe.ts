import { Pipe, PipeTransform } from '@angular/core';

/**
 * From https://github.com/fknop/angular-pipes/blob/master/src/array/map.pipe.ts
 *
 * Usage:
 *
 * ```
 * export class Component {
 *  addOne(item) {return item + 1;}
 * }
 *
 * Template:
 * <div>{{ [1, 2, 3] | map: addOne }}</div>
 *
 * Output:
 * <!-- [2, 3, 4] -->
 *
 * ```
 */
@Pipe({
    name: 'map',
})
export class MapPipe implements PipeTransform {
    transform(input: any, fn: any): any {
        if (!Array.isArray(input) || !fn) {
            return input;
        }

        return input.map(fn);
    }
}
