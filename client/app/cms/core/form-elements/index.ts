import { InputComponent } from './input/input.component';
import { TextareaComponent } from './textarea/textarea.component';
import { SelectComponent } from './select/select.component';

export * from './base.element';
export * from './form-elements.module';
export * from './select/select-item';
export * from './select/selection-factory';


export namespace Elements {
    export const Input = InputComponent;
    export type Input = InputComponent;

    export const Textarea = TextareaComponent;
    export type Textarea = TextareaComponent;

    export const Select = SelectComponent;
    export type Select = SelectComponent;
}