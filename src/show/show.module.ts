import { Module } from '@nestjs/common';
import { ShowController } from './show.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Show, SoldItem } from './entities/show.entity';
import { InventoryModule } from '../inventory/inventory.module';
import { ShowService } from './show.service';

@Module({
  imports: [InventoryModule, TypeOrmModule.forFeature([Show, SoldItem])],
  controllers: [ShowController],
  providers: [ShowService],
})
export class ShowModule {}
