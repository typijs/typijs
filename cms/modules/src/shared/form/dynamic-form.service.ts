import { CmsPropertyFactoryResolver, ContentTypeProperty } from '@typijs/core';
import { ComponentRef, Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable()
export class DynamicFormService {
    constructor(private propertyFactoryResolver: CmsPropertyFactoryResolver, private formBuilder: FormBuilder) { }

    /**
     * Creates Reactive Form from the properties of object
     * @param properties The property metadata of object
     * @param formData (Optional) The form data
     * @param initFormControls (Optional) The init form controls
     */
    createFormGroup(properties: ContentTypeProperty[], formData: { [key: string]: any } = {}, initFormControls: { [key: string]: any } = {}): FormGroup {
        if (!properties || properties.length == 0) return new FormGroup({});
        if (!formData) formData = {};

        const formControls: { [key: string]: any } = initFormControls ?? {};
        properties.forEach(property => {
            const validators = [];
            if (property.metadata.validates) {
                property.metadata.validates.forEach(validate => {
                    validators.push(validate.validateFn);
                });
            }

            // make sure form controls don't have the property
            if (!formControls.hasOwnProperty(property.name)) {
                formControls[property.name] = [formData[property.name], validators];
            } else {
                console.warn(`Duplicate the property '${property.name}' in form. Consider change the name of this property to avoid warning`);
            }
        });

        return this.formBuilder.group(formControls);
    }

    createFormFieldComponents(properties: ContentTypeProperty[], formGroup: FormGroup): ComponentRef<any>[] {
        const propertyControls: ComponentRef<any>[] = [];

        properties.forEach(property => {
            if (property.metadata && property.metadata.displayType) {
                try {
                    const propertyFactory = this.propertyFactoryResolver.resolvePropertyFactory(property.metadata.displayType);
                    const propertyComponent = propertyFactory.createPropertyComponent(property, formGroup);
                    propertyControls.push(propertyComponent);
                } catch (error) {
                    console.error(`Error on creating the component for property '${property.name}'`);
                    console.error(error);
                }
            }
        });

        return propertyControls;
    }
}
