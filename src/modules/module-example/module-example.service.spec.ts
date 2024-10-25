import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { UpdateModuleExampleDto } from './dto/update-module-example.dto';
import { ModuleExampleService } from './module-example.service';
import { Company } from '../../common/entities/company.entity';

describe('ModuleExampleService', () => {
  let service: ModuleExampleService;

  const mockCompanyRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOneOrFail: jest.fn(),
  };

  const mockEntityManager = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModuleExampleService,
        {
          provide: getRepositoryToken(Company),
          useValue: mockCompanyRepository,
        },
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get<ModuleExampleService>(ModuleExampleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of companies', async () => {
      const result = [{ id: 1, name: 'company name', logo: 'https://link-to-img' }];
      mockCompanyRepository.find.mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
      expect(mockCompanyRepository.find).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update and return the company', async () => {
      const existingCompany = { id: 1, name: 'company name', logo: 'https://link-to-img' };
      const updateDto: UpdateModuleExampleDto = { name: 'new company name', logo: '' };
      const updatedCompany = { ...existingCompany, ...updateDto };

      mockCompanyRepository.findOneOrFail.mockResolvedValue(existingCompany);
      mockEntityManager.save.mockResolvedValue(updatedCompany);

      const result = await service.update(1, updateDto);
      expect(result).toEqual(updatedCompany);
      expect(mockCompanyRepository.findOneOrFail).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockEntityManager.save).toHaveBeenCalledWith(existingCompany);
    });
  });
});
