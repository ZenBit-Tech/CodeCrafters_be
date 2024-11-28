import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'common/database/entities/company.entity';
import { Route } from 'common/database/entities/route.entity';
import { User } from 'common/database/entities/user.entity';
import { EntityManager, Repository } from 'typeorm';

import { CreateRouteDto } from './dto/create-route.dto';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepo: Repository<Route>,
    private readonly entityManager: EntityManager,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {}

  async create(createRouteDto: CreateRouteDto): Promise<Route> {
    try {
      const user = await this.entityManager.findOneOrFail(User, {
        where: { id: createRouteDto.user_id },
      });

      const company = await this.companyRepo.findOneOrFail({
        where: { id: createRouteDto.company_id },
      });

      const route: Route = this.routeRepo.create({
        ...createRouteDto,
        user_id: user,
        company_id: company,
      });

      return await this.routeRepo.save(route);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create route');
    }
  }

  async findAll(): Promise<Route[]> {
    try {
      return await this.routeRepo.find();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch routes');
    }
  }

  async findOneById(id: number): Promise<Route> {
    try {
      return await this.routeRepo.findOneOrFail({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch route by ID');
    }
  }
}
