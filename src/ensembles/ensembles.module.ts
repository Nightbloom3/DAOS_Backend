import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnsemblesController } from './ensembles.controller';
import { EnsemblesService } from './ensembles.service';
import { EnsembleSchema } from './schemas/ensemble.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Ensemble', schema: EnsembleSchema}])],
  controllers: [EnsemblesController],
  providers: [EnsemblesService]
})
export class EnsemblesModule {}
