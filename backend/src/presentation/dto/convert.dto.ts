import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConvertDto {
  @ApiProperty({ example: 10, description: 'Monto a convertir' })
  @IsNumber()
  @Min(0)
  amount!: number;

  @ApiProperty({ example: 'UF', description: 'Moneda origen' })
  @IsString()
  @IsNotEmpty()
  fromCurrency!: string;

  @ApiProperty({ example: 'CLP', description: 'Moneda destino' })
  @IsString()
  @IsNotEmpty()
  toCurrency!: string;
}
