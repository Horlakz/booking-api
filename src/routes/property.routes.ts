import { Router } from "express";

import { PropertyController } from "@/controllers/property.controller";
import {
  validatePropertyData,
  validateUUID,
} from "@/middleware/validation.middleware";
import { PropertyRepository } from "@/repositories";
import { PropertyService } from "@/services/property.service";

const router = Router();
const propertyRepository = new PropertyRepository();
const propertyService = new PropertyService(propertyRepository);
const propertyController = new PropertyController(propertyService);

router.get("/", propertyController.getAllProperties);
router.get("/:id", validateUUID, propertyController.getPropertyById);
router.get(
  "/:id/availability",
  validateUUID,
  propertyController.getPropertyAvailability
);
router.post("/", validatePropertyData, propertyController.createProperty);

export { router as propertyRoutes };
