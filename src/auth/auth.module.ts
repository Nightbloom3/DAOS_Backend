import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

// To run server use these imports
// import { ProfilesModule } from 'src/profiles/profiles.module';
// import { ProfilesController } from 'src/profiles/profiles.controller';

// To run tests use these imports
import { ProfilesModule } from './../profiles/profiles.module';
import { ProfilesController } from './../profiles/profiles.controller';

@Module({
  imports: [
    ProfilesModule,
    PassportModule,
    JwtModule.register({
      // Key to sign payload / lock it
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [ProfilesController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
