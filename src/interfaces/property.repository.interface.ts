import { Property } from "@/entity/property.entity";

export interface IPropertyRepository {
  findAll(options?: {
    limit?: number;
    offset?: number;
    availableFrom?: string;
    availableTo?: string;
  }): Promise<[Property[], number]>; // Fixed return type

  findById(id: string): Promise<Property | null>;

  findAvailability(propertyId: string): Promise<Property | null>;

  create(propertyData: PropertyCreationAttributes): Promise<Property>;

  update(
    id: string,
    propertyData: Partial<PropertyCreationAttributes>
  ): Promise<boolean>;

  delete(id: string): Promise<boolean>;
}

export interface PropertyAttributes {
  id: string;
  title: string;
  description: string;
  pricePerNight: number;
  availableFrom: Date; // fixed typo & use Date
  availableTo: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type PropertyCreationAttributes = Omit<
  PropertyAttributes,
  "id" | "createdAt" | "updatedAt"
>;
