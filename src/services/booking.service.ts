import { IBookingRepository } from "@/interfaces/booking.repository.interface";
import { IPropertyRepository } from "@/interfaces/property.repository.interface";
import { BookingCreationAttributes } from "@/models/booking.model";

export class BookingService {
  private bookingRepository: IBookingRepository;
  private propertyRepository: IPropertyRepository;

  constructor(
    bookingRepository: IBookingRepository,
    propertyRepository: IPropertyRepository
  ) {
    this.bookingRepository = bookingRepository;
    this.propertyRepository = propertyRepository;
  }

  async getAllBookings(options?: { page?: number; limit?: number }) {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const offset = (page - 1) * limit;

    const result = await this.bookingRepository.findAll({ limit, offset });

    return {
      bookings: result.rows,
      pagination: {
        currentPage: page,
        totalItems: result.count,
        totalPages: Math.ceil(result.count / limit),
        itemsPerPage: limit,
      },
    };
  }

  async getBookingById(id: string) {
    const booking = await this.bookingRepository.findById(id);
    if (!booking) {
      throw new Error("Booking not found");
    }
    return booking;
  }

  async createBooking(bookingData: BookingCreationAttributes) {
    const startDate = new Date(bookingData.startDate);
    const endDate = new Date(bookingData.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate <= today) {
      throw new Error("Booking start date must be in the future");
    }

    if (startDate >= endDate) {
      throw new Error("End date must be after start date");
    }

    const property = await this.propertyRepository.findById(
      bookingData.propertyId
    );
    if (!property) {
      throw new Error("Property not found");
    }

    const propertyStart = new Date(property.availablFrom);
    const propertyEnd = new Date(property.availableTo);

    if (startDate < propertyStart || endDate > propertyEnd) {
      throw new Error(
        `Property is only available from ${property.availablFrom} to ${property.availableTo}`
      );
    }

    const conflictingBookings =
      await this.bookingRepository.findConflictingBookings(
        bookingData.propertyId,
        bookingData.startDate,
        bookingData.endDate
      );

    if (conflictingBookings.length > 0) {
      throw new Error(
        "The selected dates are not available. Please choose different dates."
      );
    }

    return await this.bookingRepository.create(bookingData);
  }

  async updateBooking(
    id: string,
    bookingData: Partial<BookingCreationAttributes>
  ) {
    const existingBooking = await this.bookingRepository.findById(id);
    if (!existingBooking) {
      throw new Error("Booking not found");
    }

    if (bookingData.startDate || bookingData.endDate) {
      const startDate = new Date(
        bookingData.startDate || existingBooking.startDate
      );
      const endDate = new Date(bookingData.endDate || existingBooking.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate <= today) {
        throw new Error("Booking start date must be in the future");
      }

      if (startDate >= endDate) {
        throw new Error("End date must be after start date");
      }

      const propertyId = bookingData.propertyId || existingBooking.propertyId;
      const property = await this.propertyRepository.findById(propertyId);

      if (!property) {
        throw new Error("Property not found");
      }

      const propertyStart = new Date(property.availablFrom);
      const propertyEnd = new Date(property.availableTo);

      if (startDate < propertyStart || endDate > propertyEnd) {
        throw new Error(
          `Property is only available from ${property.availablFrom} to ${property.availableTo}`
        );
      }

      const conflictingBookings =
        await this.bookingRepository.findConflictingBookings(
          propertyId,
          startDate.toISOString().split("T")[0]!,
          endDate.toISOString().split("T")[0]!,
          id
        );

      if (conflictingBookings.length > 0) {
        throw new Error(
          "The selected dates are not available. Please choose different dates."
        );
      }
    }

    const updated = await this.bookingRepository.update(id, bookingData);
    if (!updated) {
      throw new Error("Failed to update booking");
    }

    return await this.bookingRepository.findById(id);
  }

  async cancelBooking(id: string) {
    const booking = await this.bookingRepository.findById(id);
    if (!booking) {
      throw new Error("Booking not found");
    }

    const today = new Date();
    const startDate = new Date(booking.startDate);

    const timeDiff = startDate.getTime() - today.getTime();
    const hoursDiff = Math.ceil(timeDiff / (1000 * 3600));

    if (hoursDiff < 24) {
      throw new Error(
        "Bookings cannot be cancelled within 24 hours of the start date"
      );
    }

    const deleted = await this.bookingRepository.delete(id);
    if (!deleted) {
      throw new Error("Failed to cancel booking");
    }

    return { message: "Booking cancelled successfully" };
  }
}
