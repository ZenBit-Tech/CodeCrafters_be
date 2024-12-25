import { Body, Controller, Delete, Get, Param, Post, SetMetadata, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Luggage } from 'common/database/entities/luggage.entity';
import { Roles } from 'common/enums/enums';
import { RolesGuard } from 'common/guards/roles.guard';
import { diskStorage } from 'multer';

import { UploadImageDto } from './dto/upload-image.dto';
import { LuggageImagesService } from './luggage-images.service';

@ApiTags('Luggage Images')
@Controller('luggage-images')
export class LuggageImagesController {
  constructor(private readonly luggageImagesService: LuggageImagesService) {}

  @Get('luggage/get-by-order/:orderId')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.DRIVER])
  @ApiOperation({ summary: 'Get luggage by order ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved luggage.',
    type: [Luggage],
  })
  @ApiResponse({
    status: 404,
    description: 'Order with the given ID was not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected error occurred.',
  })
  async getLuggageByOrderId(@Param('orderId') orderId: number): Promise<Luggage[]> {
    return this.luggageImagesService.getLuggageByOrderId(orderId);
  }

  @Post('upload')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.DRIVER])
  @ApiOperation({ summary: 'Upload an image for luggage' })
  @ApiResponse({
    status: 200,
    description: 'Image uploaded successfully for the luggage.',
    type: String,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: File must be provided.',
  })
  @ApiResponse({
    status: 404,
    description: 'Luggage with the given ID not found.',
  })
  @ApiResponse({
    status: 415,
    description: 'Unsupported Media Type: The uploaded file is not an image.',
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
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Body() uploadImageDto: UploadImageDto): Promise<string> {
    return this.luggageImagesService.uploadImage(file, uploadImageDto.luggageId);
  }

  @Delete(':luggageId')
  @UseGuards(RolesGuard)
  @SetMetadata('roles', [Roles.DRIVER])
  @ApiOperation({ summary: 'Delete all images for a specific luggage' })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted all images for the luggage.',
  })
  @ApiResponse({
    status: 404,
    description: 'Luggage with the given ID was not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected error occurred.',
  })
  async deleteImages(@Param('luggageId') luggageId: number): Promise<string> {
    return this.luggageImagesService.deleteImages(luggageId);
  }
}
