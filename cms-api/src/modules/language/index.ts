import { Provider } from "injection-js";
import { LanguageController } from "./language.controller";
import { LanguageRouter } from "./language.route";
import { LanguageService } from "./language.service";

const LanguageProviders: Provider[] = [LanguageService, LanguageController, LanguageRouter]
export { LanguageController, LanguageRouter, LanguageService, LanguageProviders };
