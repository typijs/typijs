import { InputComponent } from './input/input.component';
import { TextareaComponent } from './textarea/textarea.component';
import { PropertyListComponent } from './property-list/property-list.component';
import { TinymceComponent } from './xhtml/tinymce.component';
import { DropdownComponent } from './select/dropdown/dropdown.component';
import { CheckboxElement } from './select/checkbox/checkbox.element';

export namespace Elements {
    export const Input = InputComponent;
    export type Input = InputComponent;

    export const Textarea = TextareaComponent;
    export type Textarea = TextareaComponent;

    export const Select = DropdownComponent;
    export type Select = DropdownComponent;

    export const PropertyList = PropertyListComponent;
    export type PropertyList = PropertyListComponent; 

    export const Xhtml = TinymceComponent;
    export type Xhtml = TinymceComponent; 

    export const Checkbox = CheckboxElement;
    export type Checkbox = CheckboxElement; 
}