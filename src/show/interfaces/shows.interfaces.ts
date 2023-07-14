import { CreateShowDto } from '../dto/show.dto';

export interface ItemSold {
  itemID?: string;
  itemName?: string;
  quantity_sold: number;
}

export interface ShowPersistence<T> {
  CreateShow(createShowDto: CreateShowDto): Promise<T[]>;
  GetShow(unknown?): Promise<T>;
  GetShows(id?: unknown): Promise<T[]>;
  UpdateShow(): Promise<T>;
  DeleteShow(): Promise<unknown>;
}
