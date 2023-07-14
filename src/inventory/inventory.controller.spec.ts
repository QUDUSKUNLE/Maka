import { Test, TestingModule } from '@nestjs/testing';
import { InventoryController } from './inventory.controller';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { InventoryService } from './inventory.service';

describe('InventoryController', () => {
  let inventoryController: InventoryController;
  let inventoryService: InventoryService;
  let inventoryRepository: Inventory;
  const create: Inventory[] = [
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
      providers: [
        InventoryService,
        {
          provide: getRepositoryToken(Inventory),
          useValue: {
            create: jest.fn().mockResolvedValue(create),
            getAll: jest.fn().mockResolvedValue(create),
          },
        },
      ],
      imports: [TypeOrmModule],
    }).compile();

    inventoryController = app.get<InventoryController>(InventoryController);
    inventoryService = app.get<InventoryService>(InventoryService);
    inventoryRepository = app.get<Inventory>(Inventory);
  });
  it('should be defined', async () => {
    expect(inventoryController).toBeDefined();
  });
});
