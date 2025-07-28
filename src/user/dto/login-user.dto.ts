import { IsNotEmpty, isString, IsString } from "class-validator";


export class loginUserDto{
    @IsString()
    @IsNotEmpty()
    email :string

    @IsString()
    @IsNotEmpty()
    password:string
}