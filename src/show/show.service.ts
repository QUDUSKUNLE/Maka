import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateShowDto, SoldItemParams, GetSoldParams } from './dto/show.dto';
import { BuyItemDto } from './dto/buyItem.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ItemSold } from './interfaces/shows.interfaces';
import { InventoryService } from '../inventory/inventory.service';

@Injectable()
export class ShowService {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly prismaService: PrismaService,
  ) {}

  async CreateShow(createShowDto: CreateShowDto) {
    return await this.prismaService.show.createMany({
      data: createShowDto.createShow,
    });
  }

  GetShows() {
    return this.prismaService.show.findMany();
  }

  UpdateShow() {
    throw new Error('Method not implemented.');
  }

  DeleteShow(): Promise<unknown> {
    throw new Error('Method not implemented.');
  }

  async GetShow(showID: number) {
    const result = await this.prismaService.show.findUnique({
      where: { showID },
    });
    if (!result) throw new NotFoundException('Show not found.');
    return result;
  }

  async BuyItem(soldItemParams: SoldItemParams, soldItemDto: BuyItemDto) {
    try {
      const item = await this.inventoryService.GetInventory(
        +soldItemParams.item_ID,
      );
      if (this.checkQuantity(item.quantity, soldItemDto))
        throw new BadRequestException('Item out of stock');
      const show = await this.GetShow(+soldItemParams.show_ID);
      item.quantity -= soldItemDto.quantity;
      await this.inventoryService.UpdateInventory(item);
      return this.prismaService.soldInventories.create({
        data: {
          showId: show.showID,
          inventoryId: item.itemID,
          quantity: soldItemDto.quantity,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async GetSoldItems(
    getSoldItems: GetSoldParams,
  ): Promise<Array<ItemSold> | ItemSold> {
    if (getSoldItems.item_ID && getSoldItems.show_ID) {
      const result = await this.prismaService.soldInventories.findMany({
        where: {
          showId: +getSoldItems.show_ID,
          inventoryId: +getSoldItems.item_ID,
        },
        include: { inventory: true },
      });
      const item: ItemSold = { quantity_sold: 0 };
      for (const sold of result) {
        const itemID = `${sold.inventory.itemID}`;
        const getItem = item[itemID];
        if (!getItem) {
          item.itemID = itemID;
          item.itemName = sold.inventory.itemName;
          item.quantity_sold += sold.quantity;
        }
      }
      return item;
    }
    if (getSoldItems.show_ID) {
      const result = await this.prismaService.soldInventories.findMany({
        where: { showId: +getSoldItems.show_ID },
        include: { inventory: true },
      });
      const item: Map<string, ItemSold> = new Map();
      for (const sold of result) {
        const itemID = `${sold.inventory.itemID}`;
        const getItem = item.get(itemID);
        if (!getItem) {
          item.set(itemID, {
            itemID,
            itemName: sold.inventory.itemName,
            quantity_sold: sold.quantity,
          });
        } else {
          getItem.quantity_sold += sold.quantity;
        }
      }
      return Array.from(item.values());
    }
  }

  private checkQuantity(quantity: number, soldItemDto: BuyItemDto): boolean {
    return quantity === 0 || quantity < soldItemDto.quantity;
  }
}
