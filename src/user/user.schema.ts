import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  mobileNo: number;

  @Prop({default:true})
  isActive:boolean

  @Prop({ default: Date.now })
  createdAt: Date;
  @Prop()
  password:string
}

export const UserSchema = SchemaFactory.createForClass(User);
