import { Op } from "sequelize";

import { IBookingRepository } from "@/interfaces/booking.repository.interface";
import { Booking, Property } from "@/models";
import { BookingCreationAttributes } from "@/models/booking.model";

export class BookingRepository implements IBookingRepository {
  async findAll(options?: { limit?: number; offset?: number }) {
    const queryOptions: any = {
      include: [
        {
          model: Property,
          as: "property",
          attributes: ["id", "title", "pricePerNight"],
        },
      ],
      order: [["created_at", "DESC"]],
    };

    if (options?.limit !== undefined) {
      queryOptions.limit = options.limit;
    }
    if (options?.offset !== undefined) {
      queryOptions.offset = options.offset;
    }

    return await Booking.findAndCountAll(queryOptions);
  }

  async findById(id: string) {
    return await Booking.findByPk(id, {
      include: [
        {
          model: Property,
          as: "property",
          attributes: ["id", "title", "pricePerNight"],
        },
      ],
    });
  }

  async findConflictingBookings(
    propertyId: string,
    startDate: string,
    endDate: string,
    excludeBookingId?: string
  ) {
    const whereClause: any = {
      propertyId,
      [Op.or]: [
        {
          startDate: {
            [Op.between]: [startDate, endDate],
          },
        },
        {
          endDate: {
            [Op.between]: [startDate, endDate],
          },
        },
        {
          [Op.and]: [
            { startDate: { [Op.lte]: startDate } },
            { endDate: { [Op.gte]: endDate } },
          ],
        },
      ],
    };

    if (excludeBookingId) {
      whereClause.id = { [Op.ne]: excludeBookingId };
    }

    return await Booking.findAll({
      where: whereClause,
    });
  }

  async create(bookingData: BookingCreationAttributes) {
    return await Booking.create(bookingData);
  }

  async update(id: string, bookingData: Partial<BookingCreationAttributes>) {
    const [updatedRowsCount] = await Booking.update(bookingData, {
      where: { id },
    });
    return updatedRowsCount > 0;
  }

  async delete(id: string) {
    const deletedRowsCount = await Booking.destroy({
      where: { id },
    });
    return deletedRowsCount > 0;
  }
}
