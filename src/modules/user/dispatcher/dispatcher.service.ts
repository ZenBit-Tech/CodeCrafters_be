import { Injectable } from '@nestjs/common';

@Injectable()
export class DispatcherService {
  create() {
    return 'This action adds a new dispatcher';
  }

  findAll() {
    return `This action returns all dispatcher`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dispatcher`;
  }

  update(id: number) {
    return `This action updates a #${id} dispatcher`;
  }

  remove(id: number) {
    return `This action removes a #${id} dispatcher`;
  }
}
