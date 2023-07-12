import { Injectable } from '@nestjs/common';
import { Inventory } from './entities/inventory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateInventoryDto, UpdateInventoryDto } from './dto/inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    private readonly dataSource: DataSource,
  ) {}

  create(createInventoryDto: CreateInventoryDto) {
    const inventories = createInventoryDto.createInventory.reduce<Inventory[]>(
      (accumulator, createInventory) => {
        accumulator.push(this.inventoryRepository.create(createInventory));
        return accumulator;
      },
      [],
    );
    return this.dataSource.manager.save(inventories);
  }

  async getAll() {
    return this.inventoryRepository.createQueryBuilder().getMany();
  }

  getInventory(itemID: number): Promise<Inventory> {
    return this.inventoryRepository.findOne({ where: { itemID } });
  }

  updateInventory(updateInventoryDto: UpdateInventoryDto): Promise<Inventory> {
    return this.inventoryRepository.save(updateInventoryDto);
  }
}
