import { IsEmail, IsNotEmpty, IsString, isString } from "class-validator"


export class createEmployeeeDto {

    @IsString()
    @IsNotEmpty()
    name:string;

    @IsEmail()
    @IsNotEmpty()
    email:string;

    @IsString()
    @IsNotEmpty()
    password:string
}