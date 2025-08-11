import { AppDataSource } from "@/config/data-source";
import { Property } from "@/entity/property.entity";
import { PropertyCreationAttributes } from "@/interfaces/property.repository.interface";
import { LessThanOrEqual, MoreThanOrEqual } from "typeorm";

export class PropertyRepository {
  private propertyRepo = AppDataSource.getRepository(Property);

  async findAll(options?: {
    limit?: number;
    offset?: number;
    availableFrom?: string;
    availableTo?: string;
  }) {
    const whereClause: any = {};

    if (options?.availableFrom && options?.availableTo) {
      whereClause.availablFrom = LessThanOrEqual(options.availableFrom);
      whereClause.availableTo = MoreThanOrEqual(options.availableTo);
    }

    const findOptions: any = {
      where: whereClause,
      order: { createdAt: "DESC" },
    };
    if (typeof options?.offset === "number") {
      findOptions.skip = options.offset;
    }
    if (typeof options?.limit === "number") {
      findOptions.take = options.limit;
    }
    return await this.propertyRepo.findAndCount(findOptions);
  }

  async findById(id: string) {
    return await this.propertyRepo.findOneBy({ id });
  }

  async findAvailability(propertyId: string) {
    return await this.propertyRepo.findOne({
      where: { id: propertyId },
      relations: ["bookings"],
      order: {
        bookings: { startDate: "ASC" },
      },
      select: {
        bookings: {
          startDate: true,
          endDate: true,
        },
      },
    });
  }

  async create(propertyData: PropertyCreationAttributes) {
    const property = this.propertyRepo.create(propertyData);
    return await this.propertyRepo.save(property);
  }

  async update(id: string, propertyData: Partial<PropertyCreationAttributes>) {
    const result = await this.propertyRepo.update(id, propertyData);
    return result.affected !== undefined && result.affected > 0;
  }

  async delete(id: string) {
    const result = await this.propertyRepo.delete(id);
    return result.affected !== undefined;
    // && result.affected > 0;
  }
}
