import { BookingController } from "@/controllers/booking.controller";
import {
  validateBookingData,
  validateUUID,
} from "@/middleware/validation.middleware";
import { PropertyRepository } from "@/repositories";
import { BookingRepository } from "@/repositories/booking.repository";
import { BookingService } from "@/services/booking.service";
import { Router } from "express";

const router = Router();
const bookingRepository = new BookingRepository();
const propertyRepository = new PropertyRepository();
const bookingService = new BookingService(
  bookingRepository,
  propertyRepository
);
const bookingController = new BookingController(bookingService);

router.get("/", bookingController.getAllBookings);
router.get("/:id", validateUUID, bookingController.getBookingById);
router.post("/", validateBookingData, bookingController.createBooking);
router.put("/:id", validateUUID, bookingController.updateBooking);
router.delete("/:id", validateUUID, bookingController.cancelBooking);

export { router as bookingRoutes };
