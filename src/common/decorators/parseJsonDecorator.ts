import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const ParseAssignOrdersJson = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  const driversIds = request.query['driversIds'] ? request.query['driversIds'] : null;
  const ordersIds = request.query['ordersIds'] ? request.query['ordersIds'] : null;

  if (!driversIds) {
    throw new BadRequestException('Missing driversIds query parameter');
  }
  if (!ordersIds) {
    throw new BadRequestException('Missing ordersIds query parameter');
  }

  let parsedDriversIds: number[];
  let parsedOrdersIds: number[];
  try {
    parsedDriversIds = <number[]>JSON.parse(<string>driversIds);
    if (!Array.isArray(parsedDriversIds) || !parsedDriversIds.every((id) => typeof id === 'number')) {
      throw new Error();
    }
  } catch {
    throw new BadRequestException('Invalid JSON array for driversIds');
  }

  try {
    parsedOrdersIds = <number[]>JSON.parse(<string>ordersIds);
    if (!Array.isArray(parsedOrdersIds) || !parsedOrdersIds.every((id) => typeof id === 'number')) {
      throw new Error();
    }
  } catch {
    throw new BadRequestException('Invalid JSON array for ordersIds');
  }

  return { driversIds: parsedDriversIds, ordersIds: parsedOrdersIds };
});
