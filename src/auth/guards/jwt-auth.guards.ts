import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// using jwt.strategy.ts
export class JwtAuthGuard extends AuthGuard('jwt') {}