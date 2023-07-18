import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/inventory.dto';

@Controller('inventories')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  async Create(@Body() createInventoryDto: CreateInventoryDto) {
    await this.inventoryService.CreateInventory(createInventoryDto);
    return { message: 'Inventory submitted' };
  }

  @Get()
  GetAll() {
    return this.inventoryService.GetInventories();
  }

  @Get([':itemID'])
  Get(@Param('itemID') itemID: string) {
    return this.inventoryService.GetInventory(+itemID);
  }
}
