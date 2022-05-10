import { IsString, Length, MinLength } from 'class-validator';

class CreateUserDto {
  @IsString()
  @Length(3, 20)
  public username: string;

  @IsString()
  @MinLength(3)
  public password: string;
}

export default CreateUserDto;
