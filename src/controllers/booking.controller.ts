import { BookingService } from "@/services/booking.service";
import { Request, Response } from "express";

export class BookingController {
  private bookingService: BookingService;

  constructor(bookingService: BookingService) {
    this.bookingService = bookingService;
  }

  getAllBookings = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.bookingService.getAllBookings({ page, limit });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  };

  getBookingById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const booking = await this.bookingService.getBookingById(id!);

      res.status(200).json({
        success: true,
        data: booking,
      });
    } catch (error) {
      const statusCode =
        error instanceof Error && error.message === "Booking not found"
          ? 404
          : 500;
      res.status(statusCode).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  };

  createBooking = async (req: Request, res: Response) => {
    try {
      const { propertyId, username, startDate, endDate } = req.body;

      const booking = await this.bookingService.createBooking({
        propertyId,
        username,
        startDate,
        endDate,
      });

      res.status(201).json({
        success: true,
        data: booking,
        message: "Booking created successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Bad request",
      });
    }
  };

  updateBooking = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const booking = await this.bookingService.updateBooking(id!, req.body);

      res.status(200).json({
        success: true,
        data: booking,
        message: "Booking updated successfully",
      });
    } catch (error) {
      const statusCode =
        error instanceof Error && error.message === "Booking not found"
          ? 404
          : 400;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : "Bad request",
      });
    }
  };

  cancelBooking = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.bookingService.cancelBooking(id!);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      const statusCode =
        error instanceof Error && error.message === "Booking not found"
          ? 404
          : 400;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : "Bad request",
      });
    }
  };
}
