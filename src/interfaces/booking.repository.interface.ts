import { Booking, BookingCreationAttributes } from "@/models/booking.model";

export interface IBookingRepository {
  findAll(options?: {
    limit?: number;
    offset?: number;
  }): Promise<{ rows: Booking[]; count: number }>;

  findById(id: string): Promise<Booking | null>;

  findConflictingBookings(
    propertyId: string,
    startDate: string,
    endDate: string,
    excludeBookingId?: string
  ): Promise<Booking[]>;

  create(bookingData: BookingCreationAttributes): Promise<Booking>;

  update(
    id: string,
    bookingData: Partial<BookingCreationAttributes>
  ): Promise<boolean>;

  delete(id: string): Promise<boolean>;
}
