import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsBoolean,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'User name must be a string!' })
  @IsNotEmpty({ message: 'User name is required.' })
  @MinLength(3, { message: 'User name must be at least 3 characters.' })
  @MaxLength(50, { message: 'User name must not be longer than 50 characters.' })
  name: string;

  @IsEmail({}, { message: 'Email must be valid.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email: string;

  @IsNotEmpty({ message: 'Mobile number is required.' })
  @IsNumberString({}, { message: 'Mobile number must contain only digits.' })
  @Length(10, 10, { message: 'Mobile number must be exactly 10 digits.' })
  mobileNo: string;

  @IsString({ message: 'Password must be a string.' })
  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(8, { message: 'Password must be at least 8 characters.' })
  @MaxLength(12, { message: 'Password must not be longer than 12 characters.' })
  password: string;

 
}
  