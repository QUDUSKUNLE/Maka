import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { PrismaService } from '../prisma/prisma.service';

describe('InventoryService', () => {
  const createInventory = {
    createInventory: [
      { itemName: 'item1', quantity: 2 },
      { itemName: 'item2', quantity: 4 },
    ],
  };
  let spyInventoryService: InventoryService;
  let prisma: PrismaService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventoryService, PrismaService],
    }).compile();

    spyInventoryService = module.get<InventoryService>(InventoryService);
    prisma = module.get<PrismaService>(PrismaService);
  });
  it('should be defined', () => {
    expect(spyInventoryService).toBeDefined();
    expect(prisma).toBeDefined();
  });
  it('should return count of created inventories', async () => {
    prisma.inventory.createMany = jest.fn().mockReturnValue({ count: 2 });
    expect(await spyInventoryService.CreateInventory(createInventory)).toEqual({
      count: 2,
    });
    expect(prisma.inventory.createMany).toHaveBeenCalled();
  });
  it('should return array of inventories', async () => {
    prisma.inventory.findMany = jest.fn().mockReturnValue([
      { itemID: '1', itemName: 'item1', quantity: 2 },
      { itemID: '2', itemName: 'item2', quantity: 4 },
    ]);
    await spyInventoryService.GetInventories();
    expect(prisma.inventory.findMany).toHaveBeenCalled();
  });
  it('should return an inventory of a given id', async () => {
    prisma.inventory.findUnique = jest
      .fn()
      .mockReturnValue({ itemID: '1', itemName: 'item1', quantity: 2 });
    expect((await spyInventoryService.GetInventory(1)).itemID).toBeDefined();
    expect(prisma.inventory.findUnique).toHaveBeenCalled();
  });
  it('should return an updatedInventory of a given id and update data', async () => {
    prisma.inventory.update = jest
      .fn()
      .mockReturnValue({ itemID: '12', itemName: 'item1', quantity: 2 });
    await spyInventoryService.UpdateInventory({
      itemID: 12,
      itemName: 'item1',
      quantity: 2,
    });
    expect(prisma.inventory.update).toHaveBeenCalled();
  });
  it('should throw an error item not found with itemID=10000', () => {
    return spyInventoryService
      .GetInventory(10000)
      .catch((error) => expect(error?.message).toEqual('Item not found.'));
  });
});
