import { Router } from "express";

import { bookingRoutes } from "./booking.routes";
import { propertyRoutes } from "./property.routes";

const router = Router();

router.use("/properties", propertyRoutes);
router.use("/bookings", bookingRoutes);

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Booking API is running",
    timestamp: new Date().toISOString(),
  });
});

export { router };
