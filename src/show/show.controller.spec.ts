import { Test, TestingModule } from '@nestjs/testing';
import { ShowController } from './show.controller';
import { ShowService } from './show.service';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { BuyItemDto } from './dto/buyItem.dto';
import { CreateShowDto, SoldItemParams, GetSoldParams } from './dto/show.dto';

describe('ShowController', () => {
  let showController: ShowController;
  let spyShowService: ShowService;

  beforeAll(async () => {
    const ServiceProvider = {
      provide: ShowService,
      useFactory: () => ({
        CreateShow: jest.fn(() => []),
        GetShows: jest.fn(() => []),
        GetShow: jest.fn(() => {}),
        UpdateShow: jest.fn(() => {}),
        DeleteShow: jest.fn(() => {}),
        BuyItem: jest.fn(() => {}),
        GetSoldItems: jest.fn(() => {}),
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowController],
      providers: [
        ShowService,
        InventoryService,
        PrismaService,
        ServiceProvider,
      ],
    }).compile();

    showController = module.get<ShowController>(ShowController);
    spyShowService = module.get<ShowService>(ShowService);
  });

  it('should be defined', () => {
    expect(showController).toBeDefined();
  });
  describe('CreateShow', () => {
    it('should call CreateShow method', async () => {
      const dto = new CreateShowDto();
      const result = await showController.create(dto);
      expect(result).not.toEqual(null);
      expect(result.message).toBeDefined();
      expect(spyShowService.CreateShow).toHaveBeenCalled();
      expect(spyShowService.CreateShow).toHaveBeenCalledWith(dto);
    });
  });
  describe('GetShows', () => {
    it('should call Getshows method', async () => {
      const result = await showController.GetShows();
      expect(result).not.toEqual(null);
      expect(spyShowService.GetShows).toHaveBeenCalled();
      expect(spyShowService.GetShows).toHaveBeenCalledWith();
    });
  });
  describe('BuyItem', () => {
    it('should call BuyItem method', async () => {
      const [soldItemParams, buyItemDto] = [
        new SoldItemParams(),
        new BuyItemDto(),
      ];
      const result = await showController.BuyItem(soldItemParams, buyItemDto);
      expect(result).not.toEqual(null);
      expect(result.message).toBeDefined();
      expect(spyShowService.BuyItem).toHaveBeenCalled();
      expect(spyShowService.BuyItem).toHaveBeenCalledWith(
        soldItemParams,
        buyItemDto,
      );
    });
  });
  describe('GetSoldItems', () => {
    it('should call GetSoldItems method', async () => {
      const getSoldParams = new GetSoldParams();
      const result = await showController.GetSoldItems(getSoldParams);
      expect(result).not.toEqual(null);
      expect(spyShowService.GetSoldItems).toHaveBeenCalled();
      expect(spyShowService.GetSoldItems).toHaveBeenCalledWith(getSoldParams);
    });
  });
});
