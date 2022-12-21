import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // When a call is made that are using our JwtGuard
      // It will try and access a BearerToken
      // which if empty will throw 401
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Key to open a payload
      secretOrKey: jwtConstants.secret,
    });
  }

  // Validating that we signed the payload with our key
  // by opening the payload 'any' to see the objects match
  async validate(payload: any) {
    return { _id: payload.sub, email: payload.email, password: payload.password };
  }
}
