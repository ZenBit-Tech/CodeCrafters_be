import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { isDateValid } from 'common/helpers/isDateValid';
import { Request } from 'express';

export const parseDate = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  const from = request.query['from'] ? request.query['from'] : null;
  const to = request.query['to'] ? request.query['to'] : null;

  if (!from) {
    throw new BadRequestException('Missing driversIds query parameter');
  }
  if (!to) {
    throw new BadRequestException('Missing ordersIds query parameter');
  }

  let parsedFromDate: Date;
  let parsedToDate: Date;
  try {
    parsedFromDate = new Date(<string>from);
    if (!isDateValid(parsedFromDate)) {
      throw new Error();
    }
  } catch {
    throw new BadRequestException('Invalid JSON array for driversIds');
  }

  try {
    parsedToDate = new Date(<string>to);
    if (!isDateValid(parsedToDate)) {
      throw new Error();
    }
  } catch {
    throw new BadRequestException('Invalid JSON array for ordersIds');
  }

  return { from: parsedFromDate, to: parsedToDate };
});
