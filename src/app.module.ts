import { Module } from '@nestjs/common';
import { InventoryModule } from './inventory/inventory.module';
import { ShowModule } from './show/show.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [InventoryModule, ShowModule, PrismaModule],
})
export class AppModule {}
