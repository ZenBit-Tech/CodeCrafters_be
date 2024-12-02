import { Injectable, InternalServerErrorException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Route } from 'common/database/entities/route.entity';
import { SuccessResponse } from 'common/types/response-success.dto';
import { RouteInform } from 'common/types/routeInformResponse';
import { transformRouteObject } from 'common/utils/transformRouteObject';
import { EntityManager, EntityNotFoundError, Repository } from 'typeorm';

import { CreateRouteDto } from './dto/create-route.dto';
import { ErrorResponse } from './dto/error-response.dto';
import { FilterData, RouteData } from './types';

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

  async getOne(id: number): Promise<RouteInform> {
    try {
      const route = await this.routeRepo.findOneOrFail({
        where: { id },
        relations: ['orders'],
      });

      return transformRouteObject(route);
    } catch (error: unknown) {
      if (error instanceof EntityNotFoundError) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException("Can't get route details");
    }
  }

  async getRouteFilters(startDate: Date, endDate: Date) {
    const filters = await this.routeRepo
      .createQueryBuilder('route')
      .select(['DISTINCT user.full_name AS driver', 'COUNT(order.id) AS stopsCount', 'route.status AS status'])
      .leftJoin('route.user_id', 'user')
      .leftJoin('route.orders', 'order')
      .where('route.submission_date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('user.full_name, route.status')
      .addGroupBy('route.status')
      .getRawMany<FilterData>();

    const uniqueDrivers = Array.from(new Set(filters.map((filter) => filter.driver)));
    const uniqueStops = Array.from(new Set(filters.map((filter) => filter.stopsCount)));
    const uniqueStatuses = Array.from(new Set(filters.map((filter) => filter.status)));

    return {
      drivers: uniqueDrivers,
      stops: uniqueStops,
      statuses: uniqueStatuses,
    };
  }

  async getRoutesByDateRange(
    startDate: Date,
    endDate: Date,
    sortField: string,
    sortDirection: 'asc' | 'desc',
    searchQuery?: string,
    drivers?: string[],
    stopsCount?: number[],
    statuses?: string[],
  ) {
    const sortOrder = sortDirection === 'asc' ? 'ASC' : 'DESC';

    const validSortFields = ['id', 'submission_date', 'user_id.full_name', 'distance', 'route_time', 'ordersCount'];
    const isRouteTimeSort = sortField === 'route_time';

    if (!validSortFields.includes(sortField)) {
      throw new BadRequestException(new ErrorResponse(400, 'Invalid sort field.'));
    }

    const queryBuilder = this.routeRepo
      .createQueryBuilder('route')
      .leftJoinAndSelect('route.user_id', 'user')
      .leftJoinAndSelect('route.company_id', 'company')
      .leftJoin('route.orders', 'order')
      .where('route.submission_date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .addSelect('COUNT(order.id)', 'ordersCount')
      .groupBy('route.id');

    if (searchQuery) {
      queryBuilder.andWhere('user.full_name LIKE :searchQuery', { searchQuery: `%${searchQuery}%` });
    }

    if (drivers && drivers.length > 0) {
      queryBuilder.andWhere('user.full_name IN (:...drivers)', { drivers });
    }

    if (stopsCount && stopsCount.length > 0) {
      queryBuilder.having('COUNT(order.id) IN (:...stopsCount)', { stopsCount });
    }

    if (statuses && statuses.length > 0) {
      queryBuilder.andWhere('route.status IN (:...statuses)', { statuses });
    }

    if (isRouteTimeSort) {
      queryBuilder
        .addSelect(`TIMESTAMPDIFF(MINUTE, route.submission_date, route.arrival_date)`, 'routeMinutes')
        .orderBy('routeMinutes', sortOrder);
    } else if (sortField === 'ordersCount') {
      queryBuilder.orderBy('ordersCount', sortOrder);
    } else {
      queryBuilder.orderBy(sortField === 'user_id.full_name' ? 'user.full_name' : `route.${sortField}`, sortOrder);
    }

    const routes = await queryBuilder.getRawMany<RouteData>();

    if (!routes.length) {
      if (searchQuery) {
        throw new NotFoundException(new ErrorResponse(404, `No routes found for user with name matching "${searchQuery}"`));
      } else {
        throw new NotFoundException(new ErrorResponse(404, 'No routes found in the specified date range'));
      }
    }

    return routes;
  }
}
