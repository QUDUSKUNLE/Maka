import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/inventory.dto';

@Controller('inventories')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  async Create(@Body() createInventoryDto: CreateInventoryDto) {
    try {
      await this.inventoryService.CreateInventory(createInventoryDto);
      return { message: 'Inventory submitted' };
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  @Get()
  GetAll() {
    return this.inventoryService.GetInventories();
  }

  @Get([':itemID'])
  Get(@Param('itemID') itemID: string) {
    try {
      return this.inventoryService.GetInventory(+itemID);
    } catch (error) {
      throw error;
    }
  }
}
