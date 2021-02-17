import { Provider } from "injection-js";
import { SiteDefinitionController } from "./site-definition.controller";
import { SiteDefinitionService } from "./site-definition.service";
import { SideDefinitionRouter } from "./site-definition.route";

const SiteDefinitionProviders: Provider[] = [SiteDefinitionService, SiteDefinitionController, SideDefinitionRouter]
export { SiteDefinitionService, SiteDefinitionController, SideDefinitionRouter, SiteDefinitionProviders }