export function Injectable(target: any) {
  Reflect.defineMetadata("injectable", true, target);
}

export function Inject(token: string) {
  return function (
    target: any,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
  ) {
    const existingTokens = Reflect.getMetadata("inject:tokens", target) || [];
    existingTokens[parameterIndex] = token;
    Reflect.defineMetadata("inject:tokens", existingTokens, target);
  };
}

class AdvancedContainer {
  private services = new Map<string, any>();
  private factories = new Map<string, () => any>();

  register<T>(token: string, factory: () => T): void {
    this.factories.set(token, factory);
  }

  registerClass<T>(
    token: string,
    classConstructor: new (...args: any[]) => T
  ): void {
    this.factories.set(token, () => {
      const tokens =
        Reflect.getMetadata("inject:tokens", classConstructor) || [];
      const dependencies = tokens.map((token: string) => this.get(token));
      return new classConstructor(...dependencies);
    });
  }

  get<T>(token: string): T {
    if (this.services.has(token)) {
      return this.services.get(token);
    }

    const factory = this.factories.get(token);
    if (!factory) {
      throw new Error(`Service ${token} not registered`);
    }

    const instance = factory();
    this.services.set(token, instance);
    return instance;
  }
}

// Example usage with decorators:
/*
@Injectable
export class PropertyService {
  constructor(
    @Inject('PropertyRepository') private propertyRepository: IPropertyRepository
  ) {}
}

// In container configuration:
container.registerClass('PropertyService', PropertyService);
*/

export { AdvancedContainer };
