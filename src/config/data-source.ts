import "reflect-metadata";
import { DataSource } from "typeorm";

import { Booking } from "@/entity/booking.entity";
import { Property } from "@/entity/property.entity";
import { config } from "./env";

const {
  database: { name, user, password, host, port },
  env,
} = config;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: host ?? "localhost",
  port: port ? Number(port) : 5432,
  username: user ?? "postgres",
  password: password ?? "password",
  database: name ?? "booking_db",
  synchronize: true, // Auto-create tables
  logging: env === "development",
  entities: [Booking, Property],
});

export async function connectDb() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Database connected successfully.");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
}
