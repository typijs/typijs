import { ReflectiveInjector } from "injection-js";
import { Router } from "express";

export abstract class BaseRouter {
    protected injector: ReflectiveInjector;
    public router: Router;
    constructor(injector: ReflectiveInjector) {
        this.injector = injector;
        this.router = this.getRouter();
    }

    protected abstract getRouter(): Router;
}