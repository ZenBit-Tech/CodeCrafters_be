import { Test, TestingModule } from '@nestjs/testing';

import { ModuleExampleController } from './module-example.controller';
import { ModuleExampleService } from './module-example.service';

describe('ModuleExampleController', () => {
  let controller: ModuleExampleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModuleExampleController],
      providers: [
        {
          provide: ModuleExampleService,
          useValue: {}, // Provide a simple empty object since we are not testing service methods
        },
      ],
    }).compile();

    controller = module.get<ModuleExampleController>(ModuleExampleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
