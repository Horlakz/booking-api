import { BelongsToGetAssociationMixin, DataTypes, Optional } from "sequelize";
import { Model, Sequelize } from "sequelize-typescript";

import { Property } from "./property.model";

export interface BookingAttributes {
  id: string;
  propertyId: string;
  username: string;
  startDate: string; // DATEONLY
  endDate: string; // DATEONLY
  created_at?: Date;
}

export interface BookingCreationAttributes
  extends Optional<BookingAttributes, "id" | "created_at"> {}

export class Booking
  extends Model<BookingAttributes, BookingCreationAttributes>
  implements BookingAttributes
{
  public id!: string;
  public propertyId!: string;
  public username!: string;
  public startDate!: string;
  public endDate!: string;
  public readonly created_at!: Date;

  public getProperty!: BelongsToGetAssociationMixin<Property>;

  static associate(models: any) {
    Booking.belongsTo(models.Property, {
      foreignKey: "propertyId",
      as: "property",
    });
  }
}

export function initBookingModel(sequelize: Sequelize) {
  Booking.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      propertyId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "properties", key: "id" },
        onDelete: "CASCADE",
      },
      username: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: "bookings",
      timestamps: false,
      underscored: true,
      indexes: [{ fields: ["propertyId", "startDate", "endDate"] }],
    }
  );
  sequelize.addModels([Booking]);
}
