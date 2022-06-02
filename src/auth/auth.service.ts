import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException, Injectable } from '@nestjs/common';

import { AuthDto } from './dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument, ROLE } from './auth.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    try {
      const user = new this.authModel({
        username: dto.username,
        password: hash,
      });
      await user.save();
      return this.signToken(user.id, user.role);
    } catch (err) {
      throw err;
    }
  }

  async login(dto: AuthDto) {
    const user = await this.authModel.findOne({ username: dto.username });
    if (!user) throw new ForbiddenException('Credentials Incorrect');

    const pwMatch = await argon.verify(user.password, dto.password);
    if (!pwMatch) throw new ForbiddenException('Credentials Incorrect');

    return this.signToken(user.id, user.role);
  }

  async signToken(
    userId: number,
    role: ROLE,
  ): Promise<{ access_token: string }> {
    const token = await this.jwt.signAsync(
      { sub: userId, role },
      {
        expiresIn: '15m',
        secret: this.config.get('JWT_SECRET'),
      },
    );

    return {
      access_token: token,
    };
  }
}
