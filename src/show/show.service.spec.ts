import { Test, TestingModule } from '@nestjs/testing';
import { ShowService } from './show.service';
import { ItemSold } from './interfaces/shows.interfaces';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';

describe('ShowService', () => {
  const createShow = {
    createShow: [{ showName: 'Show 1' }, { showName: 'Show 2' }],
  };
  const soldItemParams = { item_ID: '1', show_ID: '3' };
  const soldItemShowNotFound = { item_ID: '1', show_ID: '1000000' };
  const soldItemDto = {
    quantity: 0,
  };
  const soldItemQuantityDto = {
    quantity: 1,
  };
  let service: ShowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShowService, PrismaService, InventoryService],
    }).compile();

    service = module.get<ShowService>(ShowService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should create possible number of shows', async () => {
    const show = await service.CreateShow(createShow);
    expect(show.count).toStrictEqual(createShow.createShow.length);
  });
  it('should be able to return some shows', async () => {
    const show = await service.GetShows();
    expect(typeof show).toEqual(typeof []);
  });
  it('should return an show of a given id', async () => {
    const show = await service.GetShow(1);
    expect(show.showID).toBeDefined();
    expect(typeof show.showID).toEqual('number');
  });
  it('should return a bought item from a show', async () => {
    const buyItem = await service.BuyItem(soldItemParams, soldItemQuantityDto);
    expect(buyItem.id).toBeDefined();
  });
  it('should return array of bought items', async () => {
    const items = (await service.GetSoldItems({
      show_ID: '1',
    })) as Array<ItemSold>;
    expect(items.length).toBeGreaterThanOrEqual(1);
  });
  it('should return object of bought item', async () => {
    const items = (await service.GetSoldItems({
      show_ID: '3',
      item_ID: '1',
    })) as ItemSold;
    expect(items.itemID).toBeDefined();
  });
  it('should throw an error when Update Show not implemented', () => {
    expect(() => service.UpdateShow()).toThrowError('Method not implemented.');
  });
  it('should throw an error when Delete Show not implemented', () => {
    expect(() => service.DeleteShow()).toThrowError('Method not implemented.');
  });
  it('should throw an error Show not found with showID=10000', () => {
    return service
      .GetShow(10000)
      .catch((error) => expect(error?.message).toEqual('Show not found.'));
  });
  it('should throw error order out of stock', async () => {
    return service
      .BuyItem(soldItemParams, soldItemDto)
      .catch((error) => expect(error?.message).toEqual('Item out of stock'));
  });
  it('should throw error with quantity more than what is in stock', async () => {
    return service
      .BuyItem(soldItemParams, { quantity: 1000 })
      .catch((error) => expect(error?.message).toEqual('Item out of stock'));
  });
  it('should throw error show not found', async () => {
    return service
      .BuyItem(soldItemShowNotFound, soldItemDto)
      .catch((error) => expect(error?.message).toEqual('Show not found.'));
  });
});
