import { Module } from '@nestjs/common';
import { ShowController } from './show.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { InventoryModule } from '../inventory/inventory.module';
import { ShowService } from './show.service';

@Module({
  imports: [PrismaModule, InventoryModule],
  controllers: [ShowController],
  providers: [ShowService],
})
export class ShowModule {}
