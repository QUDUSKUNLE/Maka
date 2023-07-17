import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInventoryDto, UpdateInventoryDto } from './dto/inventory.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prismaService: PrismaService) {}
  async CreateInventory(createInventoryDto: CreateInventoryDto) {
    return await this.prismaService.inventory.createMany({
      data: createInventoryDto.createInventory,
    });
  }

  GetInventories() {
    return this.prismaService.inventory.findMany();
  }

  async GetInventory(itemID: number) {
    const result = await this.prismaService.inventory.findUnique({
      where: { itemID },
    });
    if (!result) throw new NotFoundException('Item not found.');
    return result;
  }

  async UpdateInventory(updateInventoryDto: UpdateInventoryDto) {
    return this.prismaService.inventory.update({
      where: {
        itemID: updateInventoryDto.itemID,
      },
      data: { ...updateInventoryDto },
    });
  }

  DeleteInventory(id: string, unknown?: unknown) {
    throw new Error('Method not implemented.');
  }
}
