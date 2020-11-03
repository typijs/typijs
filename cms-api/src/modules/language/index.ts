import { Provider } from "injection-js";
import { LanguageController } from "./language.controller";
import { LanguageGuard } from "./language.guard";
import { LanguageRouter } from "./language.route";
import { LanguageService } from "./language.service";

const LanguageProviders: Provider[] = [LanguageService, LanguageController, LanguageRouter, LanguageGuard]
export { LanguageController, LanguageRouter, LanguageService, LanguageGuard, LanguageProviders };
