import {
  Controller,
  Get,
  Post,
  Body,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/inventory.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  async create(@Body() createInventoryDto: CreateInventoryDto) {
    try {
      await this.inventoryService.create(createInventoryDto);
      return { message: 'Inventory submitted' };
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  @Get()
  getAll() {
    return this.inventoryService.getAll();
  }
}
