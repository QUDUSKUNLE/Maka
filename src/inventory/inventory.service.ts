import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInventoryDto, UpdateInventoryDto } from './dto/inventory.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prismaService: PrismaService) {}
  CreateInventory(createInventoryDto: CreateInventoryDto) {
    try {
      return this.prismaService.inventory.createMany({
        data: createInventoryDto.createInventory,
      });
    } catch (error) {
      throw error;
    }
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
