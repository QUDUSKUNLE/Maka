import { Test, TestingModule } from '@nestjs/testing';
import { ShowService } from './show.service';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';

describe('ShowService', () => {
  let service: ShowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShowService, PrismaService, InventoryService],
    }).compile();

    service = module.get<ShowService>(ShowService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
