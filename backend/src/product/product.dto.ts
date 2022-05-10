import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsOptional()
  @MaxLength(250)
  public description?: string;

  @IsInt()
  @Min(0)
  public quantity: number;

  @IsInt()
  @Min(0)
  public price: number;

  @IsBoolean()
  public isActive: boolean;
}

export default CreateProductDto;
