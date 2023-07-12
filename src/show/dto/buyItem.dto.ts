import { IsNotEmpty, IsNumber } from 'class-validator';

export class BuyItemDto {
  @IsNotEmpty({ message: 'quantity is required' })
  @IsNumber()
  readonly quantity: number;
}
