import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { PrismaService } from '../prisma/prisma.service';

describe('InventoryService', () => {
  const createInventory = {
    createInventory: [
      { itemName: 'item1', quantity: 2 },
      { itemName: 'item2', quantity: 4 },
    ],
  };
  let service: InventoryService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventoryService, PrismaService],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should return count of created inventories', async () => {
    const inventories = await service.CreateInventory(createInventory);
    expect(inventories.count).toEqual(createInventory.createInventory.length);
  });
  it('should return array of inventories', async () => {
    const inventories = await service.GetInventories();
    expect(typeof inventories).toEqual(typeof []);
  });
  it('should return an inventory of a given id', async () => {
    const inventory = await service.GetInventory(11);
    expect(inventory.itemID).toBeDefined();
  });
  it('should return an updatedInventory of a given id and update data', async () => {
    const inventory = await service.UpdateInventory({
      itemID: 12,
      itemName: 'item1',
      quantity: 2,
    });
    expect(inventory.itemID).toBeDefined();
  });
  it('should throw an error item not found with itemID=10000', () => {
    return service
      .GetInventory(10000)
      .catch((error) => expect(error?.message).toEqual('Item not found.'));
  });
  it('should throw an error method not implemented for DeleteInventory Method', () => {
    expect(() => service.DeleteInventory('1')).toThrowError(
      'Method not implemented.',
    );
  });
});
