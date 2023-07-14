import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  CreateShowDto,
  SoldItemDto,
  SoldItemParams,
  GetSoldParams,
} from './dto/show.dto';
import { ShowService } from './show.service';

@Controller('shows')
export class ShowController {
  constructor(private readonly showService: ShowService) {}

  @Post()
  async create(@Body() createShowDto: CreateShowDto) {
    try {
      await this.showService.CreateShow(createShowDto);
      return { message: 'Content creators created successfully.' };
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  @Get()
  GetShows() {
    return this.showService.GetShows();
  }

  @Post([':show_ID/buy_items/:item_ID'])
  async buyItem(
    @Param() soldItemParams: SoldItemParams,
    @Body() soldItemDto: SoldItemDto,
  ) {
    await this.showService.BuyItem(soldItemParams, soldItemDto);
    return { message: 'Item bought successfully' };
  }

  @Get([':show_ID/sold_items', ':show_ID/sold_items/:item_ID'])
  async getSoldItems(@Param() getSoldItems: GetSoldParams) {
    return await this.showService.GetSoldItems(getSoldItems);
  }
}
