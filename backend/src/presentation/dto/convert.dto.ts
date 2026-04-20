import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class ConvertDto {
  @IsNumber()
  @Min(0)
  amount!: number;

  @IsString()
  @IsNotEmpty()
  fromCurrency!: string;

  @IsString()
  @IsNotEmpty()
  toCurrency!: string;
}
