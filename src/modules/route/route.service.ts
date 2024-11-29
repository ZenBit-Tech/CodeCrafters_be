import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Route } from 'common/database/entities/route.entity';
import { Repository } from 'typeorm';

import { ErrorResponse } from './dto/error-response.dto';

@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
  ) {}

  async getRouteById(id: number): Promise<Route> {
    const route = await this.routeRepository.findOne({
      where: { id },
      relations: ['user_id', 'company_id'],
    });

    if (!route) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }

    return route;
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
  ): Promise<Route[]> {
    const sortOrder = sortDirection === 'asc' ? 'ASC' : 'DESC';

    const validSortFields = ['id', 'submission_date', 'user_id.full_name', 'distance', 'route_time'];
    const isRouteTimeSort = sortField === 'route_time';

    if (!validSortFields.includes(sortField)) {
      throw new BadRequestException(new ErrorResponse(400, 'Invalid sort field.'));
    }

    const queryBuilder = this.routeRepository
      .createQueryBuilder('route')
      .leftJoinAndSelect('route.user_id', 'user')
      .leftJoinAndSelect('route.company_id', 'company')
      .where('route.submission_date BETWEEN :startDate AND :endDate', { startDate, endDate });

    if (searchQuery) {
      queryBuilder.andWhere('user.full_name LIKE :searchQuery', { searchQuery: `%${searchQuery}%` });
    }
    console.log(drivers);

    if (drivers && drivers.length > 0) {
      console.log(1);
      queryBuilder.andWhere('user.full_name IN (:...drivers)', { drivers });
    }

    if (stopsCount && stopsCount.length > 0) {
      queryBuilder.andWhere('route.stopsCount IN (:...stopsCount)', { stopsCount });
    }

    if (statuses && statuses.length > 0) {
      queryBuilder.andWhere('route.status IN (:...statuses)', { statuses });
    }

    if (isRouteTimeSort) {
      queryBuilder
        .addSelect(`TIMESTAMPDIFF(MINUTE, route.submission_date, route.arrival_date) AS routeMinutes`)
        .orderBy('routeMinutes', sortOrder);
    } else {
      queryBuilder.orderBy(sortField === 'user_id.full_name' ? 'user.full_name' : `route.${sortField}`, sortOrder);
    }

    const routes = await queryBuilder.getMany();

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
