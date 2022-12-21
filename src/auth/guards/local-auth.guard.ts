import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// In the string ' ' we choose what type of strategy we use for guarding
// Here we use our local.strategy.ts
// We can use other developers strategy for guarding - as and example we can can change the string to "facebook"
export class LocalAuthGuard extends AuthGuard('local') {}