import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/user/user.schema";

@Injectable()

export class authServices{
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }
   
    async UserToken(){
       console.log("authservice")
    }
}