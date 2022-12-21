import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Profile } from 'src/profiles/schemas/profile.schema';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    // we are changing the predefined values from username to email
    // Because it fits our schema for a profile/user
    super({ usernameField: 'email' })
  }

  // Validating the input from the body ( Frontend )
  async validate(email: string, password: string): Promise<Profile> {
    // Returns the profile found in the database
    const profile = await this.authService.validateProfile(email, password);

    if (!profile) {
      throw new UnauthorizedException();
    }
    return profile;
  }
}