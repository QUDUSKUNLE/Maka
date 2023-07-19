import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { InventoryModule } from '../src/inventory/inventory.module';
import { ShowModule } from '../src/show/show.module';
import { PrismaModule } from '../src/prisma/prisma.module';
import { AppointmentService } from '../src/appointment/appointment.service';
import { ShowService } from '../src/show/show.service';
import { Test } from '@nestjs/testing';
import { MakaModule } from '../src/maka.module';

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
