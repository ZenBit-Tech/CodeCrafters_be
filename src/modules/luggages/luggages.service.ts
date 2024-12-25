import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Luggage } from 'common/database/entities/luggage.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LuggagesService {
  constructor(
    @InjectRepository(Luggage)
    private readonly luggageRepository: Repository<Luggage>,
  ) {}

  async getCountOfLuggages(orderId: number): Promise<Luggage[]> {
    try {
      return await this.luggageRepository
        .createQueryBuilder('luggage')
        .select(['luggage.id', 'luggage.luggage_type', 'luggage.luggage_weight', 'luggage.luggage_description'])
        .where('luggage.order.id = :orderId', { orderId })
        .getMany();
    } catch (error) {
      throw new NotFoundException('Cant find such luggages');
    }
  }
}
