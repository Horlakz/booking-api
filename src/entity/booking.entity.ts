import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Property } from "./property.entity";

@Entity({ name: "bookings" })
export class Booking {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  propertyId: string;

  @Column({ length: 100 })
  username: string;

  @Column({ type: "date" })
  startDate: Date; // DATEONLY

  @Column({ type: "date" })
  endDate: Date; // DATEONLY

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @ManyToOne(() => Property, (property) => property.bookings, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "propertyId" })
  property: Property;
}
