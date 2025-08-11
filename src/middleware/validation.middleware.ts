import { NextFunction, Request, Response } from "express";

export const validateBookingData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { propertyId, username, startDate, endDate } = req.body;

  if (!propertyId || !username || !startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: "Property ID, username, start date, and end date are required",
    });
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
    return res.status(400).json({
      success: false,
      message: "Dates must be in YYYY-MM-DD format",
    });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({
      success: false,
      message: "Invalid date format",
    });
  }

  if (username.trim().length < 2 || username.trim().length > 100) {
    return res.status(400).json({
      success: false,
      message: "Username must be between 2 and 100 characters",
    });
  }

  next();
};

export const validatePropertyData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, description, pricePerNight, availableFrom, availableTo } =
    req.body;

  if (
    !title ||
    !description ||
    !pricePerNight ||
    !availableFrom ||
    !availableTo
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Title, description, price per night, available from, and available to are required",
    });
  }

  const price = parseFloat(pricePerNight);
  if (isNaN(price) || price <= 0) {
    return res.status(400).json({
      success: false,
      message: "Price per night must be a positive number",
    });
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?$/;

  const isValidDateFormat = (date: string) =>
    dateRegex.test(date) || isoRegex.test(date);

  if (!isValidDateFormat(availableFrom) || !isValidDateFormat(availableTo)) {
    return res.status(400).json({
      success: false,
      message: "Dates must be in YYYY-MM-DD or ISO format",
    });
  }

  const start = new Date(availableFrom);
  const end = new Date(availableTo);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({
      success: false,
      message: "Invalid date format",
    });
  }

  next();
};

export const validateUUID = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!id || !uuidRegex.test(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
    });
  }

  next();
};
