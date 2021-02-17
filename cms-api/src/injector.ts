import { InjectionToken, Provider, ReflectiveInjector, Type } from "injection-js";
import { Validator } from "./validation";

export class CmsInjector {
    private _providers: Provider[] = [];
    private _injector: ReflectiveInjector = ReflectiveInjector.fromResolvedProviders([]);

    set(providers: Provider[]) {
        this._providers = [...this._providers, ...providers];
        this._injector = ReflectiveInjector.fromResolvedProviders([...ReflectiveInjector.resolve([...this._providers])]);
    }

    get<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T): T {
        Validator.throwIfNull('_injector', this._injector);
        return this._injector.get(token, notFoundValue);
    }
}

export class Container {
    public static readonly globalInstance: CmsInjector = new CmsInjector();

    static get<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T): T {
        return this.globalInstance.get(token, notFoundValue);
    }
    static set(providers?: Provider[]): void {
        this.globalInstance.set(providers);
    }
}