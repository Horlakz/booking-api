import { IPropertyRepository } from "@/interfaces/property.repository.interface";
import { Property } from "@/models";
import { Booking } from "@/models/booking.model";
import { PropertyCreationAttributes } from "@/models/property.model";
import { Op } from "sequelize";

export class PropertyRepository implements IPropertyRepository {
  async findAll(options?: {
    limit?: number;
    offset?: number;
    availableFrom?: string;
    availableTo?: string;
  }) {
    const whereClause: any = {};

    if (options?.availableFrom && options?.availableTo) {
      whereClause[Op.and] = [
        { availablFrom: { [Op.lte]: options.availableFrom } },
        { availableTo: { [Op.gte]: options.availableTo } },
      ];
    }

    const queryOptions: any = {
      where: whereClause,
      order: [["createdAt", "DESC"]],
    };

    if (options?.limit !== undefined) {
      queryOptions.limit = options.limit;
    }
    if (options?.offset !== undefined) {
      queryOptions.offset = options.offset;
    }

    return await Property.findAndCountAll(queryOptions);
  }

  async findById(id: string) {
    return await Property.findByPk(id);
  }

  async findAvailability(propertyId: string) {
    const property = await Property.findByPk(propertyId, {
      include: [
        {
          model: Booking,
          as: "bookings",
          attributes: ["startDate", "endDate"],
          order: [["startDate", "ASC"]],
        },
      ],
    });
    return property;
  }

  async create(propertyData: PropertyCreationAttributes) {
    return await Property.create(propertyData);
  }

  async update(id: string, propertyData: Partial<PropertyCreationAttributes>) {
    const [updatedRowsCount] = await Property.update(propertyData, {
      where: { id },
    });
    return updatedRowsCount > 0;
  }

  async delete(id: string) {
    const deletedRowsCount = await Property.destroy({
      where: { id },
    });
    return deletedRowsCount > 0;
  }
}
