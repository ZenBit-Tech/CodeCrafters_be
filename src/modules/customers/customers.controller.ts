import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Customer } from 'common/database/entities/customer.entity';
import { Roles } from 'common/enums/enums';
import { RolesGuard } from 'common/guards/roles.guard';
import { diskStorage } from 'multer';

import { CustomersService } from './customers.service';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post('upload')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.DRIVER])
  @ApiOperation({ summary: 'Upload a sign for Customer' })
  @ApiResponse({
    status: 200,
    description: 'Sign upload successfully',
    type: String,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: File must be provided.',
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected error occurred during the upload process.',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async checkCustomerSign(@UploadedFile() file: Express.Multer.File, @Body() { customerId }: { customerId: number }): Promise<boolean> {
    return this.customersService.storeCustomerSign(customerId, file.destination + file.filename);
  }

  @Get('/boarding-pass-verify/:id')
  @ApiOperation({ summary: 'Verify a boarding pass' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The ID of the customer to verify the boarding pass for',
  })
  @ApiQuery({
    name: 'orderId',
    type: Number,
    description: 'The ID of the order associated with the boarding pass',
  })
  async verifyTicket(@Param('id', ParseIntPipe) id: number, @Query('orderId', ParseIntPipe) orderId: number): Promise<boolean> {
    return this.customersService.verifyTicket(id, orderId);
  }

  @Get('')
  @ApiOperation({ summary: 'Find a customer by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The ID of the customer to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved customer',
    type: Customer,
  })
  async findOne(@Query('orderId', ParseIntPipe) orderId: number): Promise<Customer> {
    return this.customersService.findOne(orderId);
  }
}
