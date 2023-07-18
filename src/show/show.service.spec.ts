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
  let spyShowService: ShowService;
  let prisma: PrismaService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShowService, PrismaService, InventoryService],
    }).compile();

    spyShowService = module.get<ShowService>(ShowService);
    prisma = module.get<PrismaService>(PrismaService);
  });
  it('should be defined', () => {
    expect(spyShowService).toBeDefined();
    expect(prisma).toBeDefined();
  });
  it('should create possible number of shows', async () => {
    prisma.show.createMany = jest.fn().mockReturnValue({ count: 2 });
    const show = await spyShowService.CreateShow(createShow);
    expect(show.count).toStrictEqual(createShow.createShow.length);
  });
  it('should be able to return some shows', async () => {
    prisma.show.findMany = jest.fn().mockReturnValue([
      { showID: '1', showName: 'Show 1' },
      { showID: '2', showName: 'Show 2' },
    ]);
    const show = await spyShowService.GetShows();
    expect(typeof show).toEqual(typeof []);
  });
  it('should return an show of a given id', async () => {
    prisma.show.findUnique = jest
      .fn()
      .mockReturnValue({ showID: 1, showName: 'Show 1' });
    const show = await spyShowService.GetShow(1);
    expect(show.showID).toBeDefined();
    expect(typeof show.showID).toEqual('number');
  });
  it('should return a bought item from a show', async () => {
    const buyItem = await spyShowService.BuyItem(
      soldItemParams,
      soldItemQuantityDto,
    );
    expect(buyItem.id).toBeDefined();
  });
  it('should return array of bought items', async () => {
    const items = (await spyShowService.GetSoldItems({
      show_ID: '1',
    })) as Array<ItemSold>;
    expect(items.length).toBeGreaterThanOrEqual(1);
  });
  it('should return object of bought item', async () => {
    const items = (await spyShowService.GetSoldItems({
      show_ID: '3',
      item_ID: '1',
    })) as ItemSold;
    expect(items.itemID).toBeDefined();
  });
  it('should throw an error when Update Show not implemented', () => {
    expect(() => spyShowService.UpdateShow()).toThrowError(
      'Method not implemented.',
    );
  });
  it('should throw an error when Delete Show not implemented', () => {
    expect(() => spyShowService.DeleteShow()).toThrowError(
      'Method not implemented.',
    );
  });
  it('should throw an error Show not found with showID=10000', () => {
    return spyShowService
      .GetShow(10000)
      .catch((error) => expect(error?.message).toEqual('Show not found.'));
  });
  it('should throw error with quantity=0', async () => {
    return spyShowService
      .BuyItem(soldItemParams, soldItemDto)
      .catch((error) => expect(error?.message).toEqual('Zero order made.'));
  });
  it('should throw error with quantity more than what is in stock', async () => {
    return spyShowService
      .BuyItem(soldItemParams, { quantity: 1000 })
      .catch((error) => expect(error?.message).toEqual('Item out of stock'));
  });
  it('should throw error show not found', async () => {
    await expect(
      spyShowService.BuyItem(soldItemShowNotFound, { quantity: 2 }),
    ).rejects.toThrowError('Show not found.');
  });
});
