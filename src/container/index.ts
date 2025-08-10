export interface IContainer {
  register<T>(key: string, factory: () => T): void;
  get<T>(key: string): T;
}

class Container implements IContainer {
  private services = new Map<string, any>();
  private factories = new Map<string, () => any>();

  register<T>(key: string, factory: () => T): void {
    this.factories.set(key, factory);
  }

  get<T>(key: string): T {
    if (this.services.has(key)) {
      return this.services.get(key);
    }

    const factory = this.factories.get(key);
    if (!factory) {
      throw new Error(`Service ${key} not registered`);
    }

    const instance = factory();
    this.services.set(key, instance);
    return instance;
  }

  override<T>(key: string, instance: T): void {
    this.services.set(key, instance);
  }

  clear(): void {
    this.services.clear();
    this.factories.clear();
  }
}

export const container = new Container();

export const SERVICE_KEYS = {
  PROPERTY_REPOSITORY: "PropertyRepository",
  BOOKING_REPOSITORY: "BookingRepository",
  PROPERTY_SERVICE: "PropertyService",
  BOOKING_SERVICE: "BookingService",
} as const;
