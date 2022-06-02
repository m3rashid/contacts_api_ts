import { Transform } from 'class-transformer';
import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Auth } from '../auth/auth.schema';

export type ContactDocument = Contact & Document;

@Schema()
export class Contact {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth',
    required: true,
  })
  user: Auth;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  info?: string;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
