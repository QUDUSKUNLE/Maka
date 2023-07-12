import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  CreateShowDto,
  SoldItemDto,
  QuerySoldParams,
  SoldItemParams,
  GetSoldParams,
} from './dto/show.dto';
import { InventoryService } from '../inventory/inventory.service';
import { Show, SoldItem } from './entities/show.entity';

@Injectable()
export class ShowService {
  constructor(
    @InjectRepository(Show)
    private readonly showRepository: Repository<Show>,
    @InjectRepository(SoldItem)
    private readonly soldItemRepository: Repository<SoldItem>,
    private readonly datasource: DataSource,
    private readonly inventoryService: InventoryService,
  ) {}

  create(createShowDto: CreateShowDto) {
    try {
      const shows = createShowDto.createShow.reduce<Show[]>(
        (accumulator, createShow) => {
          accumulator.push(this.showRepository.create(createShow));
          return accumulator;
        },
        [],
      );
      return this.datasource.manager.save(shows);
    } catch (error) {
      throw error;
    }
  }

  getShows(): Promise<Show[]> {
    return this.showRepository.createQueryBuilder().getMany();
  }

  async buyItem(soldItemParams: SoldItemParams, soldItemDto: SoldItemDto) {
    try {
      const item = await this.inventoryService.getInventory(
        +soldItemParams.item_ID,
      );
      if (
        !item ||
        item.quantity === 0 ||
        item.quantity < soldItemDto.quantity
      ) {
        throw new BadRequestException('Item out of stock');
      }
      const show = await this.getShow(+soldItemParams.show_ID);
      if (!show) {
        throw new UnauthorizedException('Show does not exist');
      }
      item.quantity -= soldItemDto.quantity;
      await this.inventoryService.updateInventory(item);
      return this.soldItemRepository.save({
        show: show,
        inventories: [item],
        quantity: soldItemDto.quantity,
      });
    } catch (error) {
      throw error;
    }
  }

  getShow(showID: number): Promise<Show> {
    try {
      return this.showRepository.findOne({ where: { showID } });
    } catch (error) {
      throw error;
    }
  }

  async getSoldItems(
    getSoldItems: GetSoldParams,
    querySoldParams: QuerySoldParams,
  ) {
    if (querySoldParams.item_ID && getSoldItems.show_ID) {
      const result = await this.datasource
        .getRepository(SoldItem)
        .createQueryBuilder('soldItem')
        .leftJoinAndSelect('soldItem.inventories', 'inventory')
        .where('soldItem.show = :showID', { showID: +getSoldItems.show_ID })
        .andWhere('inventory.itemID = :itemID', {
          itemID: +querySoldParams.item_ID,
        })
        .getMany();

      return (
        Array.from(
          result
            .reduce((accumulator, show) => {
              const itemID = `${show.inventories[0].itemID}`;
              if (!accumulator.has(itemID)) {
                accumulator.set(itemID, {
                  itemID: `${show.inventories[0].itemID}`,
                  itemName: show.inventories[0].itemName,
                  quantity_sold: show.quantity,
                });
              } else {
                const data = accumulator.get(itemID);
                data['quantity_sold'] = data['quantity_sold'] + show.quantity;
              }
              return accumulator;
            }, new Map())
            .values(),
        )[0] ?? { message: 'No item sold' }
      );
    }
    if (getSoldItems.show_ID) {
      const result = await this.datasource
        .getRepository(SoldItem)
        .createQueryBuilder('soldItem')
        .leftJoinAndSelect('soldItem.inventories', 'inventory')
        .where({ show: +getSoldItems.show_ID })
        .getMany();
      return Array.from(
        result
          .reduce((accumulator, show) => {
            const itemID = `${show.inventories[0].itemID}`;
            if (!accumulator.has(itemID)) {
              accumulator.set(itemID, {
                itemID: `${show.inventories[0].itemID}`,
                itemName: show.inventories[0].itemName,
                quantity_sold: show.quantity,
              });
            } else {
              const data = accumulator.get(itemID);
              data['quantity_sold'] = data['quantity_sold'] + show.quantity;
            }
            return accumulator;
          }, new Map())
          .values(),
      );
    }
    return [];
  }
}
