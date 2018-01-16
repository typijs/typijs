import { InputComponent } from './input/input.component';
import { TextareaComponent } from './textarea/textarea.component';
import { PropertyListComponent } from './property-list/property-list.component';
import { TinymceComponent } from './xhtml/tinymce.component';
import { DropdownComponent } from './select/dropdown/dropdown.component';
import { CheckboxComponent } from './select/checkbox/checkbox.component';
import { ContentAreaComponent } from './content-area/content-area.component';

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

    export const Checkbox = CheckboxComponent;
    export type Checkbox = CheckboxComponent; 

    export const ContentArea = ContentAreaComponent;
    export type ContentArea = ContentAreaComponent;  
}