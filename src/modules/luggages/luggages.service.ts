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

  async getCountOfLuggages(orderId: number): Promise<{ countOfLuggages: number }> {
    try {
      const countOfLuggages = await this.luggageRepository.count({ where: { order: { id: orderId } } });

      return { countOfLuggages };
    } catch (error) {
      throw new NotFoundException('Cant find such luggages');
    }
  }
}
