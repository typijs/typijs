import { Provider, ResolvedReflectiveProvider, ReflectiveInjector } from "injection-js";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserRouter } from "./user.route";

const UserProviders: Provider[] = [UserService, UserController, UserRouter]
export const ResolveUserProviders: ResolvedReflectiveProvider[] = ReflectiveInjector.resolve(UserProviders);