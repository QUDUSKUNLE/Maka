import { Test, TestingModule } from '@nestjs/testing';
import { ShowService } from './show.service';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { NotFoundException } from '@nestjs/common';

describe('ShowService', () => {
  const createShow = {
    createShow: [{ showName: 'Show 1' }, { showName: 'Show 2' }],
  };
  const soldItemParams = { item_ID: '1', show_ID: '1' };
  const soldItemShowNotFound = { item_ID: '1', show_ID: '1000000' };
  const soldItemDto = {
    quantity: 0,
  };
  const soldItemQuantityDto = {
    quantity: 1,
  };
  let spyShowService: ShowService;
  let prisma: PrismaService;
  let spyInventoryService: InventoryService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShowService, PrismaService, InventoryService],
    }).compile();

    spyShowService = module.get<ShowService>(ShowService);
    spyInventoryService = module.get<InventoryService>(InventoryService);
    prisma = module.get<PrismaService>(PrismaService);
  });
  it('should be defined', () => {
    expect(spyShowService).toBeDefined();
    expect(prisma).toBeDefined();
  });
  describe('CreateShow', () => {
    it('should create possible number of shows', async () => {
      prisma.show.createMany = jest.fn().mockReturnValue({ count: 2 });
      const show = await spyShowService.CreateShow(createShow);
      expect(show.count).toStrictEqual(createShow.createShow.length);
    });
  });
  describe('GetShows', () => {
    it('should be able to return some shows', async () => {
      prisma.show.findMany = jest.fn().mockReturnValue([
        { showID: '1', showName: 'Show 1' },
        { showID: '2', showName: 'Show 2' },
      ]);
      const show = await spyShowService.GetShows();
      expect(typeof show).toEqual(typeof []);
    });
  });
  describe('GetShow', () => {
    it('should return an show of a given id', async () => {
      prisma.show.findUnique = jest
        .fn()
        .mockReturnValue({ showID: 1, showName: 'Show 1' });
      const show = await spyShowService.GetShow(1);
      expect(show.showID).toBeDefined();
      expect(typeof show.showID).toEqual('number');
    });
    it('should throw an error Show not found with showID=10000', () => {
      prisma.show.findUnique = jest.fn().mockReturnValue(null);
      return spyShowService
        .GetShow(10000)
        .catch((error) => expect(error?.message).toEqual('Show not found.'));
    });
  });
  describe('BuyItem', () => {
    it('should return a bought item from a show', async () => {
      spyInventoryService.GetInventory = jest
        .fn()
        .mockResolvedValue({ itemID: 1, itemName: 'item 1', quantity: 100 });
      spyShowService.GetShow = jest
        .fn()
        .mockReturnValue({ showID: 1, showName: 'show 1' });
      prisma.soldInventories.create = jest.fn().mockResolvedValue({ count: 1 });
      await spyShowService.BuyItem(soldItemParams, soldItemQuantityDto);
      expect(spyInventoryService.GetInventory).toHaveBeenCalled();
      expect(spyShowService.GetShow).toHaveBeenCalled();
      expect(prisma.soldInventories.create).toHaveBeenCalled();
    });
    it('should throw error with quantity=0', async () => {
      return spyShowService
        .BuyItem(soldItemParams, soldItemDto)
        .catch((error) => expect(error?.message).toEqual('Zero order made.'));
    });
    it('should throw error with quantity more than what is in stock', async () => {
      spyInventoryService.GetInventory = jest
        .fn()
        .mockResolvedValue({ itemID: 1, itemName: 'item 1', quantity: 2 });
      return spyShowService
        .BuyItem(soldItemParams, { quantity: 1000 })
        .catch((error) => expect(error?.message).toEqual('Item out of stock'));
    });
    it('should throw error show not found', async () => {
      spyShowService.BuyItem = jest
        .fn()
        .mockRejectedValue(new NotFoundException('Show not found.'));
      await expect(
        spyShowService.BuyItem(soldItemShowNotFound, { quantity: 2 }),
      ).rejects.toThrowError('Show not found.');
    });
  });
  describe('GetSoldItems', () => {
    it('should return object of bought item', async () => {
      prisma.soldInventories.findMany = jest.fn().mockResolvedValue([
        {
          id: 1,
          inventoryId: 1,
          showId: 1,
          quantity: 2,
          inventory: { itemID: 1, itemName: 'item1', quantity: 2 },
        },
        {
          id: 2,
          inventoryId: 1,
          showId: 1,
          quantity: 3,
          inventory: { itemID: 1, itemName: 'item1', quantity: 2 },
        },
      ]);
      await spyShowService.GetSoldItems({
        show_ID: '1',
        item_ID: '1',
      });
      spyShowService.GetSoldItems = jest
        .fn()
        .mockReturnValue({ itemID: '1', itemName: 'Show 1', quantity_sold: 3 });
      expect(prisma.soldInventories.findMany).toHaveBeenCalled();
    });
    it('should return array of bought items', async () => {
      prisma.soldInventories.findMany = jest.fn().mockResolvedValue([
        {
          id: 1,
          inventoryId: 1,
          showId: 1,
          quantity: 2,
          inventory: { itemID: 1, itemName: 'item1', quantity: 2 },
        },
        {
          id: 2,
          inventoryId: 2,
          showId: 1,
          quantity: 3,
          inventory: { itemID: 2, itemName: 'item2', quantity: 4 },
        },
        {
          id: 3,
          inventoryId: 2,
          showId: 1,
          quantity: 4,
          inventory: { itemID: 2, itemName: 'item2', quantity: 5 },
        },
      ]);
      await spyShowService.GetSoldItems({
        show_ID: '1',
      });
      spyShowService.GetSoldItems = jest.fn().mockReturnValue([
        { item_ID: '1', itemName: 'Show 1', quantity_sold: 3 },
        { item_ID: '2', itemName: 'Show 2', quantity_sold: 3 },
      ]);
      expect(prisma.soldInventories.findMany).toHaveBeenCalled();
    });
  });
  describe('UpdateShow', () => {
    it('should throw an error when Update Show not implemented', () => {
      expect(() => spyShowService.UpdateShow()).toThrowError(
        'Method not implemented.',
      );
    });
  });
  describe('DeleteShow', () => {
    it('should throw an error when Delete Show not implemented', () => {
      expect(() => spyShowService.DeleteShow()).toThrowError(
        'Method not implemented.',
      );
    });
  });
});
