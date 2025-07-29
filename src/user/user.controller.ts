import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
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
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string; data: User }> {
    const newUser = await this.userService.createUser(createUserDto);
    const { password, ...result } = newUser.toObject();
    return {
      message: 'User created successfully',
      data: result,
    };
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @UseGuards(AuthGuard)
  @Get('name/:name')
  async getUserByName(@Param('name') name: string) {
    const user = await this.userService.getUserByName(name);
    return user || { message: 'User not found' };
  }

  @UseGuards(AuthGuard)
  @Get('id')
  async getUserById(@Query('id') id: string) {
    const user = await this.userService.getUserById(id);
    return user || { message: 'User not found' };
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.updateUser(id, updateUserDto);
    return {
      message: 'User updated successfully',
      data: user,
    };
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const user = await this.userService.deleteUser(id);
    return {
      message: 'User deleted successfully',
      data: user,
    };
  }

  @Post('login')
  async loginUser(
    @Body() dto: loginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{
    message: string;
    user: any;
    accessToken: string;
    refreshToken: string;
  }> {
    const { user, accessToken, refreshToken } = await this.userService.login(dto);

    res.cookie('AccessToken', accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie('RefreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      message: 'Login successful',
      user,
      accessToken,
      refreshToken,
    };
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('AccessToken');
    res.clearCookie('RefreshToken');
    return { message: 'Logout successfully' };
  }
}
