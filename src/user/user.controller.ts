import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<{ message: string; data: User }> {
        const newUser = await this.userService.createUser(createUserDto);
        return {
            message: 'User created successfully',
            data: newUser,
        };
    }

    @Get()
    async getAllUsers(): Promise<User[]> {
        return this.userService.getAllUsers();
    }


    @Get('name/:name')
    async getUserByName(@Param('name') name: string) {
        const user = await this.userService.getUserByName(name);
        return user || { message: 'User not found' };
    }

    @Put(":id")
    async updateUser(@Param('id') id: string ,@Body() updateUserDto: UpdateUserDto) {
        const user = await this.userService.updateUser(id, updateUserDto);
        return {
            message: 'User updated successfully',
            data: user,
        };
    }

    @Delete(":id")
    async deleteUser(@Param('id') id:string){
        const user = await this.userService.deleteUser(id)
        return{
            message :'user delete successfully',

        }
    }

    


}
