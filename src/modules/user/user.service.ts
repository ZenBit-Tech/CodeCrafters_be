import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ORDER_PAGE_LENGTH } from 'common/constants/numbers';
import { User } from 'common/database/entities/user.entity';
import { Roles } from 'common/enums/enums';
import { FindManyOptions, FindOptionsWhere, Like, Not, Repository } from 'typeorm';

import { UserQueryParams } from './types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(queryParams: UserQueryParams): Promise<{ users: User[]; page: number; pagesCount: number }> {
    const { sortBy, role, page = 1, search = '' } = queryParams;

    const pageNumber: number = Math.max(Number(page), 1);

    const parsedSortBy: Record<string, 'ASC' | 'DESC'> = sortBy
      ? <Record<string, 'ASC' | 'DESC'>>JSON.parse(sortBy)
      : { createdAt: 'DESC' };

    const whereCondition: FindOptionsWhere<User>[] = [
      {
        company_id: { id: queryParams.companyId },
        role: Not(Roles.SUPERADMIN),
        ...(role && { role }),
        ...(search && { full_name: Like(`%${search}%`) }),
      },
      {
        company_id: { id: queryParams.companyId },
        role: Not(Roles.SUPERADMIN),
        ...(role && { role }),
        ...(search && { email: Like(`%${search}%`) }),
      },
    ];

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

  async deleteUser(userId: number): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new BadRequestException(`User with ID ${userId} not found`);
      }

      await this.userRepository.remove(user);
    } catch (error) {
      throw new InternalServerErrorException('Error deleting user');
    }
  }
}
