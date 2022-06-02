import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { getEnvPath } from './common/helper/env.helper';
import { ContactModule } from './contact/contact.module';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    MongooseModule.forRoot(`mongodb://localhost/${process.env.DB_NAME}`),
    AuthModule,
    ContactModule,
  ],
})
export class AppModule {}
