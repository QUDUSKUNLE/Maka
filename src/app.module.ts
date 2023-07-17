import { Module } from '@nestjs/common';
import { InventoryModule } from './inventory/inventory.module';
import { ShowModule } from './show/show.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppointmentService } from './appointment/appointment.service';

@Module({
  imports: [InventoryModule, ShowModule, PrismaModule],
  providers: [AppointmentService],
})
export class AppModule {}
