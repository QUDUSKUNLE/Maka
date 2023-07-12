import {
  Entity,
  Column,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';

import { SoldItem } from '../../show/entities/show.entity';

@Entity('Inventory')
export class Inventory {
  @PrimaryGeneratedColumn()
  itemID: number;

  @Column()
  itemName: string;

  @ManyToMany(() => SoldItem, (soldItem) => soldItem.inventories, {
    cascade: true,
  })
  @JoinTable()
  soldItems: SoldItem[];

  @Column()
  quantity: number;

  @Column({ type: 'datetime' })
  @CreateDateColumn()
  public createdAt: Date;

  @Column({ type: 'datetime' })
  @UpdateDateColumn()
  public updatedAt: Date;
}
