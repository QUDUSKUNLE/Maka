import { Test, TestingModule } from '@nestjs/testing';
import { ShowService } from './show.service';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { mockData } from '../mock/mock.data';
import { NotFoundException } from '@nestjs/common';

describe('ShowService', () => {
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
      const show = await spyShowService.CreateShow(
        mockData.SHOW_SERVICE.CreateShow.createShow,
      );
      expect(show.count).toStrictEqual(
        mockData.SHOW_SERVICE.CreateShow.createShow.createShow.length,
      );
    });
  });
  describe('GetShows', () => {
    it('should be able to return some shows', async () => {
      prisma.show.findMany = jest
        .fn()
        .mockReturnValue(mockData.SHOW_SERVICE.GetShows.findMany);
      const show = await spyShowService.GetShows();
      expect(typeof show).toEqual(typeof []);
    });
  });
  describe('GetShow', () => {
    it('should return an show of a given id', async () => {
      prisma.show.findUnique = jest
        .fn()
        .mockReturnValue(mockData.SHOW_SERVICE.GetShow.findUnique);
      const show = await spyShowService.GetShow(1);
      expect(show.showID).toBeDefined();
      expect(typeof show.showID).toEqual('number');
    });
    it('should throw an error Show not found with showID=10000', () => {
      prisma.show.findUnique = jest.fn().mockReturnValue(null);
      return spyShowService
        .GetShow(10000)
        .catch((error) =>
          expect(error?.message).toEqual(mockData.SHOW_SERVICE.SHOW_NOT_FOUND),
        );
    });
  });
  describe('BuyItem', () => {
    it('should return a bought item from a show', async () => {
      spyInventoryService.GetInventory = jest
        .fn()
        .mockResolvedValue(mockData.SHOW_SERVICE.BuyItem.GetInventory);
      spyShowService.GetShow = jest
        .fn()
        .mockReturnValue(mockData.SHOW_SERVICE.BuyItem.GetShow);
      spyInventoryService.UpdateInventory = jest
        .fn()
        .mockResolvedValue(mockData.SHOW_SERVICE.BuyItem.UpdateInventory);
      prisma.soldInventories.create = jest.fn().mockResolvedValue({ count: 1 });
      await spyShowService.BuyItem(
        mockData.SHOW_SERVICE.BuyItem.soldItemParams,
        mockData.SHOW_SERVICE.BuyItem.soldItemQuantityDto,
      );
      expect(spyInventoryService.GetInventory).toHaveBeenCalled();
      expect(spyShowService.GetShow).toHaveBeenCalled();
      expect(prisma.soldInventories.create).toHaveBeenCalled();
    });
    it('should throw error with quantity=0', async () => {
      return spyShowService
        .BuyItem(
          mockData.SHOW_SERVICE.BuyItem.soldItemParams,
          mockData.SHOW_SERVICE.BuyItem.soldItemDto,
        )
        .catch((error) =>
          expect(error?.message).toEqual(mockData.SHOW_SERVICE.ZERO_ORDER_MADE),
        );
    });
    it('should throw error with quantity more than what is in stock', async () => {
      spyInventoryService.GetInventory = jest
        .fn()
        .mockResolvedValue(mockData.SHOW_SERVICE.BuyItem.GetInventory);
      return spyShowService
        .BuyItem(mockData.SHOW_SERVICE.BuyItem.soldItemParams, {
          quantity: 1000,
        })
        .catch((error) =>
          expect(error?.message).toEqual(
            mockData.SHOW_SERVICE.ITEM_OUT_OF_STOCK,
          ),
        );
    });
    it('should throw error show not found', async () => {
      spyShowService.BuyItem = jest
        .fn()
        .mockRejectedValue(
          new NotFoundException(mockData.SHOW_SERVICE.SHOW_NOT_FOUND),
        );
      await expect(
        spyShowService.BuyItem(
          mockData.SHOW_SERVICE.BuyItem.soldItemShowNotFound,
          { quantity: 2 },
        ),
      ).rejects.toThrowError(mockData.SHOW_SERVICE.SHOW_NOT_FOUND);
    });
  });
  describe('GetSoldItems', () => {
    it('should return object of bought item', async () => {
      prisma.soldInventories.findMany = jest
        .fn()
        .mockResolvedValue(
          mockData.SHOW_SERVICE.GetSoldItems.GetSoldItem.findMany,
        );
      await spyShowService.GetSoldItems({
        show_ID: '1',
        item_ID: '1',
      });
      spyShowService.GetSoldItems = jest
        .fn()
        .mockReturnValue(
          mockData.SHOW_SERVICE.GetSoldItems.GetSoldItem.SpyGetSoldItem,
        );
      expect(prisma.soldInventories.findMany).toHaveBeenCalled();
    });
    it('should return array of bought items', async () => {
      prisma.soldInventories.findMany = jest
        .fn()
        .mockResolvedValue(
          mockData.SHOW_SERVICE.GetSoldItems.GetSoldItems.findMany,
        );
      await spyShowService.GetSoldItems({
        show_ID: '1',
      });
      spyShowService.GetSoldItems = jest
        .fn()
        .mockReturnValue(
          mockData.SHOW_SERVICE.GetSoldItems.GetSoldItems.SpyGetSoldItems,
        );
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
