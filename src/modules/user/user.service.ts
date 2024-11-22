import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ORDER_PAGE_LENGTH } from 'common/constants/numbers';
import { User } from 'common/database/entities/user.entity';
import { FindManyOptions, FindOptionsWhere, Like, Repository } from 'typeorm';

import { UserQueryParams } from './types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(queryParams: UserQueryParams, companyId: number): Promise<{ users: User[]; page: number; pagesCount: number }> {
    const { sortBy, filterBy, page = 1, search = '' } = queryParams;

    const pageNumber: number = typeof page === 'number' ? page : 1;

    let parsedSortBy: Record<string, 'ASC' | 'DESC'> = { full_name: 'ASC' };
    if (sortBy) {
      try {
        parsedSortBy = <Record<string, 'ASC' | 'DESC'>>JSON.parse(sortBy);
      } catch (error) {
        throw new BadRequestException('Invalid sortBy format');
      }
    }

    const whereCondition: FindOptionsWhere<User> = {
      ...(search && { full_name: Like(`%${search}%`) }),
      ...(filterBy && { role: filterBy }),
      company_id: { id: companyId },
    };

    const findSettings: FindManyOptions<User> = {
      skip: (pageNumber - 1) * ORDER_PAGE_LENGTH,
      take: ORDER_PAGE_LENGTH,
      relations: ['company_id'],
      where: whereCondition,
      order: parsedSortBy,
    };

    try {
      const [users, usersCount] = await this.userRepository.findAndCount(findSettings);

      return { users, page: pageNumber, pagesCount: Math.ceil(usersCount / ORDER_PAGE_LENGTH) };
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

  create() {
    return 'This action adds a new user';
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
