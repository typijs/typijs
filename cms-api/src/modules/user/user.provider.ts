import { Provider, ResolvedReflectiveProvider, ReflectiveInjector } from "injection-js";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";

const UserProviders: Provider[] = [UserService, UserController]
export const ResolveUserProviders: ResolvedReflectiveProvider[] = ReflectiveInjector.resolve(UserProviders);