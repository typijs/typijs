import { Provider, ResolvedReflectiveProvider, ReflectiveInjector } from "injection-js";
import { SiteDefinitionController } from "./site-definition.controller";
import { SiteDefinitionService } from "./site-definition.service";
import { SideDefinitionRouter } from "./site-definition.route";

const SiteDefinitionProviders: Provider[] = [SiteDefinitionService, SiteDefinitionController, SideDefinitionRouter]
export const ResolveSiteDefinitionProviders: ResolvedReflectiveProvider[] = ReflectiveInjector.resolve(SiteDefinitionProviders);