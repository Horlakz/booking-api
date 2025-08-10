import { Property, PropertyCreationAttributes } from "@/models/property.model";

export interface IPropertyRepository {
  findAll(options?: {
    limit?: number;
    offset?: number;
    availableFrom?: string;
    availableTo?: string;
  }): Promise<{ rows: Property[]; count: number }>;

  findById(id: string): Promise<Property | null>;

  findAvailability(propertyId: string): Promise<Property | null>;

  create(propertyData: PropertyCreationAttributes): Promise<Property>;

  update(
    id: string,
    propertyData: Partial<PropertyCreationAttributes>
  ): Promise<boolean>;

  delete(id: string): Promise<boolean>;
}
