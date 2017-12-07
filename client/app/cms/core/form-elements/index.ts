import { InputComponent } from './input/input.component';

export * from './base.element';
export * from './form-elements.module';

export namespace Elements {
    export const Input = InputComponent;
    export type Input = InputComponent;
}