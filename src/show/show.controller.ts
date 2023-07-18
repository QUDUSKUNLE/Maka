import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreateShowDto, SoldItemParams, GetSoldParams } from './dto/show.dto';
import { BuyItemDto } from './dto/buyItem.dto';
import { ShowService } from './show.service';

@Controller('shows')
export class ShowController {
  constructor(private readonly showService: ShowService) {}

  @Post()
  async create(@Body() createShowDto: CreateShowDto) {
    await this.showService.CreateShow(createShowDto);
    return { message: 'Content creators created successfully.' };
  }

  @Get()
  GetShows() {
    return this.showService.GetShows();
  }

  @Post([':show_ID/buy_items/:item_ID'])
  async BuyItem(
    @Param() soldItemParams: SoldItemParams,
    @Body() soldItemDto: BuyItemDto,
  ) {
    await this.showService.BuyItem(soldItemParams, soldItemDto);
    return { message: 'Item bought successfully' };
  }

  @Get([':show_ID/sold_items', ':show_ID/sold_items/:item_ID'])
  async GetSoldItems(@Param() getSoldItems: GetSoldParams) {
    return await this.showService.GetSoldItems(getSoldItems);
  }
}
