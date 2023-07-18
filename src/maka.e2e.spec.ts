import * as request from 'supertest';
import { InventoryModule } from './inventory/inventory.module';
import { ShowModule } from './show/show.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppointmentService } from './appointment/appointment.service';
import { ShowService } from './show/show.service';
import { Test } from '@nestjs/testing';
import { MakaModule } from './maka.module';
import { INestApplication } from '@nestjs/common';

describe('MakaModule', () => {
  let maka: INestApplication;
  const showService = { GetShows: () => [] };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [MakaModule, InventoryModule, ShowModule, PrismaModule],
      providers: [AppointmentService],
    })
      .overrideProvider(ShowService)
      .useValue(showService)
      .compile();
    maka = moduleRef.createNestApplication();
    await maka.init();
  });
  it('/GET shows', () => {
    return request(maka.getHttpServer())
      .get('/shows')
      .expect(200)
      .expect(showService.GetShows());
  });

  afterAll(async () => await maka.close());
});
