import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema()

export class Employee extends Document {
    @Prop({ required: true })
    name: string;
    @Prop({ required: true, unique: true })
    email: string
    @Prop({ required: true })
    password: string
    @Prop()
    profile_image: string
    @Prop({ default: null })
    phone_no: number
    @Prop({ default: null })
    address: string
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee)