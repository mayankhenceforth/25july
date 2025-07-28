import { Body, Controller, Delete, Get, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { loginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { AuthGuard } from 'src/guards/auth/auth.guard';


@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    @Post("register")
    async createUser(@Body() createUserDto: CreateUserDto): Promise<{ message: string; data: User }> {
        const newUser = await this.userService.createUser(createUserDto);
        return {
            message: 'User created successfully',
            data: newUser,
        };
    }
    @UseGuards(AuthGuard)
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
    async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        const user = await this.userService.updateUser(id, updateUserDto);
        return {
            message: 'User updated successfully',
            data: user,
        };
    }

    @Delete(":id")
    async deleteUser(@Param('id') id: string) {
        const user = await this.userService.deleteUser(id)
        return {
            message: 'user delete successfully',

        }
    }
    @Post('login')
    async loginUser(
        @Body() dto: loginUserDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<{ message: string; user: any }> {
        const { user, token } = await this.userService.login(dto);


        res.cookie('auth_token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        return {
            message: 'Login successful',
            user,
        };
    }


    @Get('logout')
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('auth_token');
        return { message: 'Logout successfully' };
    }


}
