import { IsEmail, IsNotEmpty, IsNumber, IsOptional,IsString } from "class-validator";

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    name:string;

    @IsEmail()
    @IsOptional()
    email :string;

    @IsNumber()
    @IsOptional()
    mobileNo :number

    @IsString()
    @IsOptional()
    password :string
}  