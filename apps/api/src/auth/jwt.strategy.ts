import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: {
    sub: string;
    username: string;
    role: string;
    name: string;
    garageId: string;
    garageCode: string;
  }) {
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
      name: payload.name,
      garageId: payload.garageId,
      garageCode: payload.garageCode,
    };
  }
}
