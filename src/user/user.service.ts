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
    constructor(@InjectModel(User.name) private userModel: Model<User> ,
    private readonly jwtService :JwtService
) { }

    async createUser(dto: CreateUserDto): Promise<User> {
  const exists = await this.userModel.findOne({ email: dto.email });
  if (exists) {
    throw new ConflictException('Email already exists');
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(dto.password, salt);

  const user = new this.userModel({
    ...dto,
    password: hashedPassword,
  });

  return user.save();
}

    async getAllUsers(): Promise<User[]> {
        return this.userModel.find().exec();
    }
    async getUserByName(name: string) {
        return this.userModel.find({ name }).exec();
    }

    async updateUser(id: string, updates: Partial<User>) {

        if (updates.email) {
            const existsEmail = await this.userModel.find({
                _id: { $ne: id },
                email: updates.email,
            });
            // console.log(existsEmail.length)

            if (existsEmail.length > 0) {
                throw new NotFoundException('Email already exist');
            
            }

        }

        const updateUser = await this.userModel.findByIdAndUpdate(id, updates, {
            new: true
        })

        if (!updateUser) {
            throw new NotFoundException('User not found');
        }
        return updateUser
    }

    async deleteUser(id: string) {
        const existIdAndDeleteUser = await this.userModel.findByIdAndDelete(id)

        console.log(existIdAndDeleteUser)
        if (!existIdAndDeleteUser) {
            throw new NotFoundException("In this id user not exist database")
        }
        return existIdAndDeleteUser
    }
async login(dto: loginUserDto): Promise<{ user: User; token: string }> {
  const user = await this.userModel.findOne({ email: dto.email });

  if (!user) {
    throw new ConflictException('User email not found');
  }

  const isPasswordValid = await bcrypt.compare(dto.password, user.password);
  if (!isPasswordValid) {
    throw new ConflictException('Password does not match');
  }

  const payload = { user_id: user._id, email: user.email };
  const token = await this.jwtService.signAsync(payload);

  return {
    user,
    token,
  };
}

}
