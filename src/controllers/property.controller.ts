import { PropertyService } from "@/services/property.service";
import { Request, Response } from "express";

export class PropertyController {
  private propertyService: PropertyService;

  constructor(propertyService?: PropertyService) {
    if (!propertyService) {
      throw new Error(
        "PropertyService instance must be provided to PropertyController"
      );
    }
    this.propertyService = propertyService;
  }

  getAllProperties = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const availableFrom = req.query.availableFrom as string;
      const availableTo = req.query.availableTo as string;

      const result = await this.propertyService.getAllProperties({
        page,
        limit,
        availableFrom,
        availableTo,
      });

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

  getPropertyById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const property = await this.propertyService.getPropertyById(id!);

      res.status(200).json({
        success: true,
        data: property,
      });
    } catch (error) {
      const statusCode =
        error instanceof Error && error.message === "Property not found"
          ? 404
          : 500;
      res.status(statusCode).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  };

  getPropertyAvailability = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const availability = await this.propertyService.getPropertyAvailability(
        id!
      );

      res.status(200).json({
        success: true,
        data: availability,
      });
    } catch (error) {
      const statusCode =
        error instanceof Error && error.message === "Property not found"
          ? 404
          : 500;
      res.status(statusCode).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  };

  createProperty = async (req: Request, res: Response) => {
    try {
      const property = await this.propertyService.createProperty(req.body);

      res.status(201).json({
        success: true,
        data: property,
        message: "Property created successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Bad request",
      });
    }
  };
}
