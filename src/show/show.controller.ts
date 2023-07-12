import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Show } from './entities/show.entity';
import {
  CreateShowDto,
  SoldItemDto,
  SoldItemParams,
  QuerySoldParams,
  GetSoldParams,
} from './dto/show.dto';
import { ShowService } from './show.service';

@Controller('show')
export class ShowController {
  constructor(private readonly showService: ShowService) {}

  @Post()
  async create(@Body() createShowDto: CreateShowDto) {
    try {
      await this.showService.create(createShowDto);
      return { message: 'Content creators seeded successfully.' };
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  @Get()
  getShow(): Promise<Show[]> {
    return this.showService.getShows();
  }

  @Post(':show_ID/buy_item/:item_ID')
  async buyItem(
    @Param() soldItemParams: SoldItemParams,
    @Body() soldItemDto: SoldItemDto,
  ) {
    await this.showService.buyItem(soldItemParams, soldItemDto);
    return { message: 'Item bought successfully' };
  }

  @Get(':show_ID/sold_items')
  async getSoldItems(
    @Param() getSoldItems: GetSoldParams,
    @Query() querySoldParams: QuerySoldParams,
  ) {
    return await this.showService.getSoldItems(getSoldItems, querySoldParams);
  }
}
