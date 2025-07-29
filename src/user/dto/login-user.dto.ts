import { IsEmail, IsNotEmpty, isString, IsString } from "class-validator";


export class loginUserDto{
    @IsEmail({}, { message: 'Email must be valid.' })
      @IsNotEmpty({ message: 'Email is required.' })
      email: string;

    @IsString()
    @IsNotEmpty()
    password:string
}