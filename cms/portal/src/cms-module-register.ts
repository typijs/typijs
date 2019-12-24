import { registerPageModule, registerBlockModule, registerMediaModule, registerSiteManageModule } from '@angular-cms/modules';

export const registerCmsModules = [
    registerPageModule(),
    registerBlockModule(),
    registerMediaModule(),
    registerSiteManageModule()
]