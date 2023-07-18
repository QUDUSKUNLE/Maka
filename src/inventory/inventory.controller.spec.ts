import { Test, TestingModule } from '@nestjs/testing';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInventoryDto } from './dto/inventory.dto';

describe('InventoryController', () => {
  let inventoryController: InventoryController;
  let spyInventoryService: InventoryService;
  beforeAll(async () => {
    const ServiceProvider = {
      provide: InventoryService,
      useFactory: () => ({
        CreateInventory: jest.fn(() => []),
        GetInventories: jest.fn(() => []),
        GetInventory: jest.fn(() => {}),
        UpdateInventory: jest.fn(() => {}),
        DeleteInventory: jest.fn(() => {}),
      }),
    };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [InventoryService, PrismaService, ServiceProvider],
    }).compile();

    inventoryController = app.get<InventoryController>(InventoryController);
    spyInventoryService = app.get<InventoryService>(InventoryService);
  });
  it('should be defined', () => {
    expect(inventoryController).toBeDefined();
  });
  it('should call CreateInventory method', async () => {
    const dto = new CreateInventoryDto();
    const result = await inventoryController.Create(dto);
    expect(result).not.toEqual(null);
    expect(result.message).toBeDefined();
    expect(spyInventoryService.CreateInventory).toHaveBeenCalled();
    expect(spyInventoryService.CreateInventory).toHaveBeenCalledWith(dto);
  });
  it('should call GetAll method', async () => {
    const result = await inventoryController.GetAll();
    expect(result).not.toEqual(null);
    expect(spyInventoryService.GetInventories).toHaveBeenCalled();
    expect(spyInventoryService.GetInventories).toHaveBeenCalledWith();
  });
  it('should call Get method', async () => {
    const itemID = {
      itemID: '1',
    };
    const result = await inventoryController.Get(itemID.itemID);
    expect(result).not.toEqual(null);
    expect(spyInventoryService.GetInventory).toHaveBeenCalled();
    expect(spyInventoryService.GetInventory).toHaveBeenCalledWith(
      +itemID.itemID,
    );
  });
});
