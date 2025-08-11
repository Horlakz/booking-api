import { Between, LessThanOrEqual, MoreThanOrEqual, Not } from "typeorm";

import { AppDataSource } from "@/config/data-source";
import { Booking } from "@/entity/booking.entity";
import {
  BookingCreationAttributes,
  IBookingRepository,
} from "@/interfaces/booking.repository.interface";

export class BookingRepository implements IBookingRepository {
  private bookingRepo = AppDataSource.getRepository(Booking);

  async findAll(options?: { limit?: number; offset?: number }) {
    const findOptions: any = {
      relations: ["property"],
      select: {
        property: { id: true, title: true, pricePerNight: true },
      },
      order: { createdAt: "DESC" },
    };

    if (typeof options?.offset === "number") {
      findOptions.skip = options.offset;
    }
    if (typeof options?.limit === "number") {
      findOptions.take = options.limit;
    }

    return await this.bookingRepo.findAndCount(findOptions);
  }

  async findById(id: string) {
    return await this.bookingRepo.findOne({
      where: { id },
      relations: ["property"],
      select: {
        // property: { id: true, title: true, pricePerNight: true },
      },
    });
  }

  async findConflictingBookings(
    propertyId: string,
    startDate: string,
    endDate: string,
    excludeBookingId?: string
  ) {
    const whereClause: any = [
      {
        propertyId,
        startDate: Between(startDate, endDate),
      },
      {
        propertyId,
        endDate: Between(startDate, endDate),
      },
      {
        propertyId,
        startDate: LessThanOrEqual(startDate),
        endDate: MoreThanOrEqual(endDate),
      },
    ];

    if (excludeBookingId) {
      whereClause.forEach((clause: any) => {
        clause.id = Not(excludeBookingId);
      });
    }

    return await this.bookingRepo.find({
      where: whereClause,
    });
  }

  async create(bookingData: BookingCreationAttributes) {
    const booking = this.bookingRepo.create(bookingData);
    return await this.bookingRepo.save(booking);
  }

  async update(id: string, bookingData: Partial<BookingCreationAttributes>) {
    const result = await this.bookingRepo.update(id, bookingData);
    return result.affected !== undefined && result.affected > 0;
  }

  async delete(id: string) {
    const result = await this.bookingRepo.delete(id);
    return result.affected !== undefined;
    //  && result.affected > 0;
  }
}
