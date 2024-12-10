import { Injectable, InternalServerErrorException, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { ROUTE_START_POINT } from 'common/constants/strings';
import { Order } from 'common/database/entities/order.entity';
import { Route } from 'common/database/entities/route.entity';
import { User } from 'common/database/entities/user.entity';
import { SortOrder } from 'common/enums/enums';
import { createRouteNotificationMail } from 'common/helpers/createEmailTemplates';
import { MailerService } from 'common/mailer/mailer.service';
import { SuccessResponse } from 'common/types/response-success.dto';
import { RouteInform } from 'common/types/routeInformResponse';
import { transformRouteObject } from 'common/utils/transformRouteObject';
import { DeleteResult, EntityManager, EntityNotFoundError, In, Repository, Between } from 'typeorm';

import { CreateRouteDto } from './dto/create-route.dto';
import { ErrorResponse } from './dto/error-response.dto';
import { FilterData, RouteData } from './types';

@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepo: Repository<Route>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly entityManager: EntityManager,
    private readonly configService: ConfigService,
    private readonly smtpService: MailerService,
  ) {}

  async create(createRouteDto: CreateRouteDto[]): Promise<SuccessResponse> {
    try {
      const routes = createRouteDto.map((routeDto) => new Route(routeDto));

      for (const route of routes) {
        await this.routeRepo.save(route);
      }
      await this.entityManager.save(routes);

      const driverIds = [...new Set(routes.map((route) => route.user_id))].filter(Boolean);

      const users = await this.userRepo.find({
        where: { id: In(driverIds) },
      });

      for (const user of users) {
        await this.smtpService.sendEmail({
          from: {
            name: this.configService.getOrThrow('APP_NAME'),
            address: this.configService.getOrThrow('DEFAULT_EMAIL_FROM'),
          },
          recipients: [{ name: user.full_name, address: user.email }],
          subject: 'New Route Notification',
          html: createRouteNotificationMail({
            username: user.full_name,
          }),
          placeholderReplacements: {},
        });
      }

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

  async getOneForDriver(id: number): Promise<RouteInform> {
    try {
      const route = await this.routeRepo.findOneOrFail({
        where: { user_id: { id } },
        relations: ['orders'],
      });

      return transformRouteObject(route);
    } catch (error: unknown) {
      if (error instanceof EntityNotFoundError) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException("Can't get route details for driver");
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
    const sortOrder: SortOrder = sortDirection === 'asc' ? SortOrder.ASC : SortOrder.DESC;

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

  async calculateRouteDistance(cities: string[]) {
    try {
      const geocodeCity = async (city: string) => {
        const url = `${this.configService.getOrThrow('OPENSTREET_API')}/search?city=${encodeURIComponent(city)}&format=json`;
        const response = await axios.get(url);
        if (!response.data.length) throw new Error(`No results found for ${city}`);
        const { lat, lon } = <{ lat: number; lon: number }>response.data[0];
        return { name: city, lat, lon };
      };

      const geocodedCities = await Promise.all(
        cities.map((city) =>
          geocodeCity(city).catch(() => {
            return null;
          }),
        ),
      );

      const validCities = geocodedCities.filter((city) => city !== null);
      if (validCities.length < 2) throw new Error('Not enough valid cities to calculate a route.');

      const coordinates = validCities.map((city) => `${city.lon},${city.lat}`).join(';');
      const osrmUrl = `${this.configService.getOrThrow('CALCULATE_DISTANCE_LINK')}/${coordinates}?overview=full`;

      const routeResponse = await axios.get(osrmUrl);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const route = routeResponse.data.routes[0];
      return {
        distance: <number>route.distance,
      };
    } catch (error: unknown) {
      return null;
    }
  }

  async removeOrderFromRoute(routeId: number, orderId: number): Promise<RouteInform> {
    try {
      const route = await this.routeRepo.findOneOrFail({ where: { id: routeId }, relations: ['orders'] });

      if (!route.orders.some((order) => order.id === orderId)) {
        throw new BadRequestException();
      }

      const order = await this.orderRepo.findOneOrFail({ where: { id: orderId } });
      order.route = null;
      await this.entityManager.save(order);

      const updatedRoute = await this.routeRepo.findOneOrFail({ where: { id: routeId }, relations: ['orders'] });

      const cities = updatedRoute.orders.map(
        (orderData) => orderData.collection_address.split(',')[orderData.collection_address.split(',').length - 2],
      );

      await this.calculateRouteDistance([ROUTE_START_POINT, ...cities]).then(async (result) => {
        if (result) {
          updatedRoute.distance = Math.ceil(result.distance / 1000);
          await this.entityManager.save(updatedRoute);
        }
      });

      return await this.getOne(routeId);
    } catch (error) {
      throw new NotFoundException('There is no such order');
    }
  }

  async deleteRoute(routeId: number): Promise<SuccessResponse> {
    try {
      const deletedRoute: DeleteResult = await this.routeRepo.softDelete(routeId);

      if (deletedRoute.affected !== undefined && deletedRoute.affected !== null) {
        if (deletedRoute.affected < 1) throw new Error();
      } else {
        throw new Error();
      }

      return { status: 200, message: 'route deleted successfully' };
    } catch (error) {
      throw new NotFoundException('There is no such route');
    }
  }

  async getRoutesForRender(from: Date, to: Date): Promise<RouteInform[]> {
    try {
      const startDate = new Date(new Date(from).setHours(0, 0, 0, 0));
      const endDate = new Date(to);
      const routes = await this.routeRepo.find({
        where: {
          arrival_date: Between(startDate, endDate),
        },
        relations: ['orders'],
      });

      return routes.map((route) => transformRouteObject(route));
    } catch (error) {
      throw new InternalServerErrorException('');
    }
  }
}
