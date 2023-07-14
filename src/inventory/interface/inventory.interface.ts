import { CreateInventoryDto, UpdateInventoryDto } from '../dto/inventory.dto';

export interface InventoryPersistence<T> {
  CreateInventory(createInventoryDto: CreateInventoryDto): Promise<T | T[]>;
  GetInventory(id: number): Promise<T>;
  GetInventories(unknown?: unknown): Promise<T[]>;
  UpdateInventory(updateInventoryDto: UpdateInventoryDto): Promise<T>;
  DeleteInventory(id: string, unknown?: unknown): Promise<unknown>;
}
