import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryModule } from './inventory/inventory.module';
import { ShowModule } from './show/show.module';

@Module({
  imports: [
    InventoryModule,
    ShowModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'maka.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
