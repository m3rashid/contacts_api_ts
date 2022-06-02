import { Document } from 'mongoose';
import { Transform } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AuthDocument = Auth & Document;

export enum ROLE {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Schema()
export class Auth {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({ required: true, trim: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: 'USER' })
  role: ROLE;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
