import { Booking } from "@/entity/booking.entity";

export interface IBookingRepository {
  findAll(options?: {
    limit?: number;
    offset?: number;
  }): Promise<[Booking[], number]>;

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

export interface BookingAttributes {
  id: string;
  propertyId: string;
  username: string;
  startDate: Date; // use Date for better TypeORM mapping
  endDate: Date;
  createdAt: Date;
}

export type BookingCreationAttributes = Omit<
  BookingAttributes,
  "id" | "createdAt"
>;
