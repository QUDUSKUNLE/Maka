import { Test, TestingModule } from '@nestjs/testing';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { PrismaService } from '../prisma/prisma.service';

describe('InventoryController', () => {
  let inventoryController: InventoryController;
  let inventoryService: InventoryService;
  const create = [
    {
      itemID: 1,
      itemName: 'Apple 1',
      quantity: 20,
      soldItems: [],
      createdAt: new Date('2023-07-12T13:53:57.898Z'),
      updatedAt: new Date('2023-07-12T13:53:57.898Z'),
    },
  ];

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [InventoryService, PrismaService],
    }).compile();

    inventoryController = app.get<InventoryController>(InventoryController);
    inventoryService = app.get<InventoryService>(InventoryService);
  });
  it('should be defined', async () => {
    expect(inventoryController).toBeDefined();
  });
});
