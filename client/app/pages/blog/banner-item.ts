import { Property, ValidationTypes } from "../../cms/core/decorators/index";
import { UIType } from "../../cms/core/index";

export class BannerItem{
    
        @Property({
            displayName: "Title",
            displayType: UIType.Input,
            validates: [
                ValidationTypes.required("This is min required"), 
                ValidationTypes.minLength(1, "This is min message"), 
                ValidationTypes.maxLength(10, "This is max message")]
        })
        title: string;
    
        @Property({
            displayName: "This is content",
            displayType: UIType.Textarea,
            validates: [ValidationTypes.required("This is min required")]
        })
        content: string;
    }