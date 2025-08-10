import { container, SERVICE_KEYS } from "@/container";
import { IBookingRepository } from "@/interfaces/booking.repository.interface";
import { IPropertyRepository } from "@/interfaces/property.repository.interface";
import { BookingRepository } from "@/repositories/booking.repository";
import { PropertyRepository } from "@/repositories/property.repository";
import { BookingService } from "@/services/booking.service";
import { PropertyService } from "@/services/property.service";

export function configureContainer() {
  container.register(
    SERVICE_KEYS.PROPERTY_REPOSITORY,
    () => new PropertyRepository()
  );
  container.register(
    SERVICE_KEYS.BOOKING_REPOSITORY,
    () => new BookingRepository()
  );

  container.register(SERVICE_KEYS.PROPERTY_SERVICE, () => {
    const propertyRepository = container.get<IPropertyRepository>(
      SERVICE_KEYS.PROPERTY_REPOSITORY
    );
    return new PropertyService(propertyRepository);
  });

  container.register(SERVICE_KEYS.BOOKING_SERVICE, () => {
    const bookingRepository = container.get<IBookingRepository>(
      SERVICE_KEYS.BOOKING_REPOSITORY
    );
    const propertyRepository = container.get<IPropertyRepository>(
      SERVICE_KEYS.PROPERTY_REPOSITORY
    );
    return new BookingService(bookingRepository, propertyRepository);
  });
}

export function getPropertyService() {
  return container.get<PropertyService>(SERVICE_KEYS.PROPERTY_SERVICE);
}

export function getBookingService() {
  return container.get<BookingService>(SERVICE_KEYS.BOOKING_SERVICE);
}
