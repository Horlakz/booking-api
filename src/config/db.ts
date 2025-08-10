import { Sequelize } from "sequelize-typescript";

import { config } from "./env";

const {
  database: { name, user, password, host, port },
} = config;

export const sequelize = new Sequelize(
  name ?? "booking_db",
  user ?? "root",
  password ?? "password",
  {
    host: host ?? "localhost",
    port: port ? Number(port) : 5432,
    // models: [Booking, Property],
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    define: { underscored: true, freezeTableName: true },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export const connectDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
};
