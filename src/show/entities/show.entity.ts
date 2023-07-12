import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { Inventory } from '../../inventory/entities/inventory.entity';

@Entity('Show')
export class Show {
  @PrimaryGeneratedColumn()
  showID: number;

  @Column()
  showName: string;

  @OneToMany(() => SoldItem, (soldItem) => soldItem.show, { cascade: true })
  soldItems: SoldItem[];

  @Column({ type: 'datetime' })
  @CreateDateColumn()
  public createdAt: Date;

  @Column({ type: 'datetime' })
  @UpdateDateColumn()
  public updatedAt: Date;
}

@Entity('SoldItem')
export class SoldItem {
  @PrimaryGeneratedColumn()
  soldItemID: number;

  @ManyToOne(() => Show, (show) => show.soldItems)
  @JoinColumn({ name: 'showID' })
  show: Show;

  @ManyToMany(() => Inventory, (inventory) => inventory.soldItems)
  inventories: Inventory[];

  @Column()
  quantity: number;

  @Column({ type: 'datetime' })
  @CreateDateColumn()
  public createdAt: Date;

  @Column({ type: 'datetime' })
  @UpdateDateColumn()
  public updatedAt: Date;
}
