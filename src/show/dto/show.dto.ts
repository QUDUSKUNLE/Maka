import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  IsArray,
} from 'class-validator';
import { PartialType, OmitType, PickType } from '@nestjs/mapped-types';

class ShowDto {
  @IsOptional()
  readonly showID?: number;

  @IsString()
  @Length(3)
  readonly showName: string;
}

export class CreateShowDto {
  @IsArray()
  readonly createShow: ShowDto[];
}

export class SoldItemDto {
  @IsNumber()
  readonly quantity: number;
}

export class QuerySoldParams {
  @IsString()
  @IsOptional()
  item_ID?: string;
}

export class GetSoldParams {
  @IsString()
  @IsNotEmpty()
  show_ID: string;
}

export class SoldItemParams {
  @IsString()
  @IsNotEmpty()
  item_ID: string;

  @IsString()
  @IsNotEmpty()
  show_ID: string;
}
