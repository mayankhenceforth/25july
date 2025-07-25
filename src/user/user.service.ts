import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async createUser(dto: CreateUserDto): Promise<User> {
        const exists = await this.userModel.findOne({ email: dto.email });
        if (exists) {
            throw new ConflictException('Email already exists');
        }

        const user = new this.userModel(dto);
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
}
