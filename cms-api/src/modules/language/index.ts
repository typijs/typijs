import { Provider } from "injection-js";
import { LanguageController } from "./language.controller";
import { LanguageRouter } from "./language.route";

const LanguageProviders: Provider[] = [LanguageController, LanguageRouter]
export { LanguageController, LanguageRouter, LanguageProviders };
