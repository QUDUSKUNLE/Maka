import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { PrismaService } from '../prisma/prisma.service';

describe('InventoryService', () => {
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
  const createInventory = {
    createInventory: [
      { itemName: 'item1', quantity: 2 },
      { itemName: 'item1', quantity: 2 },
    ],
  };
  describe('CreateInventory', () => {
    it('should return count of created inventories', async () => {
      const inventories = await service.CreateInventory(createInventory);
      expect(inventories.count).toEqual(createInventory.createInventory.length);
    });
  });
  describe('GetInventories', () => {
    it('should return array of inventories', async () => {
      const inventories = await service.GetInventories();
      expect(typeof inventories).toEqual(typeof []);
    });
  });
  describe('GetInventory', () => {
    it('should return an inventory of a given id', async () => {
      const inventory = await service.GetInventory(11);
      expect(inventory.itemID).toBeDefined();
    });
  });
  describe('UpdateInventory', () => {
    it('should return an inventory of a given id', async () => {
      const inventory = await service.UpdateInventory({
        itemID: 12,
        itemName: 'item1',
        quantity: 2,
      });
      expect(inventory.itemID).toBeDefined();
    });
  });
});
