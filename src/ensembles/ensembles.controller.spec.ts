import { Test, TestingModule } from '@nestjs/testing';
import { EnsemblesController } from './ensembles.controller';

describe('EnsemblesController', () => {
  let controller: EnsemblesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnsemblesController],
    }).compile();

    controller = module.get<EnsemblesController>(EnsemblesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
