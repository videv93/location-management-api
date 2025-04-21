import { Entity, Column, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from 'typeorm';

/**
 * Location Entity - Represents locations in hierarchical tree structure
 */
@Entity()
@Tree('materialized-path')
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ name: 'location_number', nullable: false, unique: true })
  locationNumber: string;

  @Column({ type: 'float', nullable: true })
  area: number;

  @TreeParent()
  parent: Location | null;

  @TreeChildren()
  children: Location[];

  @Column({ nullable: true })
  building: string;

  @Column({ nullable: true })
  level: string;

  @Column({ nullable: true })
  type: string; // Room, Corridor, Toilet, etc.

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
