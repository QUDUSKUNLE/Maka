import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  IsArray,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class InventoryDto {
  @IsString()
  @Length(3)
  readonly itemName: string;

  @IsNotEmpty({ message: 'quantity is required' })
  @IsNumber()
  readonly quantity: number;
}

export class CreateInventoryDto {
  @IsArray()
  readonly createInventory: InventoryDto[];
}

export class UpdateInventoryDto extends PartialType(InventoryDto) {
  @IsNumber()
  readonly itemID: number;
}
