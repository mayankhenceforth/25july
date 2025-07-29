import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { loginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  private getJwtPayload(user: User) {
    return {
      id: user._id,
      email: user.email,
    };
  }

  private async signToken(payload: any, expiresIn: string): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn,
      secret: process.env.JWT_SECRET,
    });
  }

  async generateAccessToken(user: User): Promise<string> {
    return this.signToken(this.getJwtPayload(user), '1d');
  }

  async generateRefreshToken(user: User): Promise<string> {
    return this.signToken(this.getJwtPayload(user), '7d');
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({ email: dto.email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, await bcrypt.genSalt());
    const createdUser = new this.userModel({
      ...dto,
      password: hashedPassword,
      
    });
    return createdUser.save();
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getUserByName(name: string): Promise<User[]> {
    return this.userModel.find({ name,}).exec();
  }

  async getUserById(id: string): Promise<User[]> {
    return this.userModel.find({ _id: id }).exec();
  }

  async updateUser(id: string, updates: Partial<UpdateUserDto>): Promise<User> {
    if (updates.email) {
      const emailTaken = await this.userModel.exists({
        _id: { $ne: id },
        email: updates.email,
      });

      if (emailTaken) {
        throw new ConflictException('Email already exists');
      }
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async deleteUser(id: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: id, isActive: true });

    if (!user) {
      throw new NotFoundException('User not found or already deleted');
    }

    const deletedUser = await this.userModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );

    return user;
  }

  async login(dto: loginUserDto): Promise<{
    user: User;
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.userModel.findOne({ email: dto.email });

    if (!user || !user.isActive) {
      throw new ConflictException('Email not found or user inactive');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new ConflictException('Invalid password');
    }

    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    return { user, accessToken, refreshToken };
  }
}
