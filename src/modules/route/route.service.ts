import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Route } from 'common/database/entities/route.entity';
import { SuccessResponse } from 'common/types/response-success.dto';
import { EntityManager, EntityNotFoundError, Repository } from 'typeorm';

import { CreateRouteDto } from './dto/create-route.dto';

@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepo: Repository<Route>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createRouteDto: CreateRouteDto[]): Promise<SuccessResponse> {
    try {
      const routes = createRouteDto.map((routeDto) => new Route(routeDto));

      for (const route of routes) {
        await this.routeRepo.save(route);
      }
      await this.entityManager.save(routes);
      return { status: 201, message: 'Routes have been successfully created!' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getOne(id: number): Promise<Route> {
    try {
      return await this.routeRepo.findOneOrFail({
        where: { id },
        relations: ['orders'],
      });
    } catch (error: unknown) {
      if (error instanceof EntityNotFoundError) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException("Can't get route details");
    }
  }
}
