import { DataTypes, HasManyGetAssociationsMixin, Optional } from "sequelize";
import { Model, Sequelize } from "sequelize-typescript";

import { Booking } from "./booking.model";

export interface PropertyAttributes {
  id: string;
  title: string;
  description: string;
  pricePerNight: number;
  availablFrom: string; // DATEONLY
  availableTo: string; // DATEONLY
  createdAt?: Date;
  updatedAt?: Date;
}
export interface PropertyCreationAttributes
  extends Optional<PropertyAttributes, "id" | "createdAt" | "updatedAt"> {}

export class Property
  extends Model<PropertyAttributes, PropertyCreationAttributes>
  implements PropertyAttributes
{
  public id!: string;
  public title!: string;
  public description!: string;
  public pricePerNight!: number;
  public availablFrom!: string;
  public availableTo!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getBookings!: HasManyGetAssociationsMixin<Booking>;

  static associate(models: any) {
    Property.hasMany(models.Booking, {
      foreignKey: "propertyId",
      as: "bookings",
      onDelete: "CASCADE",
    });
  }
}

export function initPropertyModel(sequelize: Sequelize) {
  Property.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      pricePerNight: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: { min: 0 },
      },
      availablFrom: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      availableTo: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "properties",
      timestamps: true,
      underscored: true,
      indexes: [{ fields: ["availableTo"] }],
    }
  );
  sequelize.addModels([Property]);
}
