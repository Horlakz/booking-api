import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Booking } from "./booking.entity";

@Entity({ name: "properties" })
export class Property {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 150 })
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  pricePerNight: number;

  @Column({ type: "date" })
  availableFrom: Date; // DATEONLY

  @Column({ type: "date" })
  availableTo: Date; // DATEONLY

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @OneToMany(() => Booking, (booking) => booking.property, {
    cascade: true,
    onDelete: "CASCADE",
  })
  bookings: Booking[];
}
