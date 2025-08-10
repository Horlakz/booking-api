import { IPropertyRepository } from "@/interfaces/property.repository.interface";
import { PropertyCreationAttributes } from "@/models/property.model";

export class PropertyService {
  private propertyRepository: IPropertyRepository;

  constructor(propertyRepository: IPropertyRepository) {
    this.propertyRepository = propertyRepository;
  }

  async getAllProperties(options?: {
    page?: number;
    limit?: number;
    availableFrom?: string;
    availableTo?: string;
  }) {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const offset = (page - 1) * limit;

    const queryOptions: any = {
      limit,
      offset,
    };

    if (options?.availableFrom && options?.availableTo) {
      queryOptions.availableFrom = options.availableFrom;
      queryOptions.availableTo = options.availableTo;
    }

    const result = await this.propertyRepository.findAll(queryOptions);

    return {
      properties: result.rows,
      pagination: {
        currentPage: page,
        totalItems: result.count,
        totalPages: Math.ceil(result.count / limit),
        itemsPerPage: limit,
      },
    };
  }

  async getPropertyById(id: string) {
    const property = await this.propertyRepository.findById(id);
    if (!property) {
      throw new Error("Property not found");
    }
    return property;
  }

  async getPropertyAvailability(propertyId: string) {
    const property = await this.propertyRepository.findAvailability(propertyId);
    if (!property) {
      throw new Error("Property not found");
    }

    const bookings = (property as any).bookings || [];
    const availableRanges: Array<{ from: string; to: string }> = [];

    const propertyStart = new Date(property.availablFrom);
    const propertyEnd = new Date(property.availableTo);

    if (bookings.length === 0) {
      availableRanges.push({
        from: property.availablFrom,
        to: property.availableTo,
      });
    } else {
      const sortedBookings = bookings.sort(
        (a: any, b: any) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );

      let currentDate = propertyStart;

      for (const booking of sortedBookings) {
        const bookingStart = new Date(booking.startDate);

        if (currentDate < bookingStart) {
          const gapEnd = new Date(bookingStart);
          gapEnd.setDate(gapEnd.getDate() - 1);

          availableRanges.push({
            from: currentDate.toISOString().split("T")[0]!,
            to: gapEnd.toISOString().split("T")[0]!,
          });
        }

        const bookingEnd = new Date(booking.endDate);
        bookingEnd.setDate(bookingEnd.getDate() + 1);
        currentDate = bookingEnd;
      }

      if (currentDate <= propertyEnd) {
        availableRanges.push({
          from: currentDate.toISOString().split("T")[0]!,
          to: property.availableTo,
        });
      }
    }

    return {
      property: {
        id: property.id,
        title: property.title,
        availableFrom: property.availablFrom,
        availableTo: property.availableTo,
      },
      availableRanges,
      bookings: bookings.map((booking: any) => ({
        startDate: booking.startDate,
        endDate: booking.endDate,
      })),
    };
  }

  async createProperty(propertyData: PropertyCreationAttributes) {
    const availableFrom = new Date(propertyData.availablFrom);
    const availableTo = new Date(propertyData.availableTo);

    if (availableFrom >= availableTo) {
      throw new Error("Available from date must be before available to date");
    }

    if (propertyData.pricePerNight <= 0) {
      throw new Error("Price per night must be greater than 0");
    }

    return await this.propertyRepository.create(propertyData);
  }
}
