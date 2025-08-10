import { sequelize } from "@/config/db";
import { Booking, initBookingModel } from "./booking.model";
import { initPropertyModel, Property } from "./property.model";

initPropertyModel(sequelize);
initBookingModel(sequelize);

Property.associate({ Booking });
Booking.associate({ Property });

export { Booking, Property, sequelize };
