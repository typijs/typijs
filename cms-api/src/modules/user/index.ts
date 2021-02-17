import { Provider } from "injection-js";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserRouter } from "./user.route";

const UserProviders: Provider[] = [UserService, UserController, UserRouter]
export { UserService, UserController, UserRouter, UserProviders };