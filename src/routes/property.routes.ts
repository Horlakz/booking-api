import { Router } from "express";

import { PropertyController } from "@/controllers/property.controller";
import { PropertyRepository } from "@/repositories";
import { PropertyService } from "@/services";

const router = Router();
const propertyRepository = new PropertyRepository();
const propertyService = new PropertyService(propertyRepository);
const propertyController = new PropertyController(propertyService);

router.get("/", propertyController.getAllProperties);
// router.get("/:id", validateUUID, propertyController.getPropertyById);
// router.get(
//   "/:id/availability",
//   validateUUID,
//   propertyController.getPropertyAvailability
// );
// router.post("/", validatePropertyData, propertyController.createProperty);

export { router as propertyRoutes };
